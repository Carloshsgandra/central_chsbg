import { getUser, handleAuthCallback, login, logout, requestPasswordRecovery, signup, updateUser } from '../vendor/netlify-identity.js';
import { store } from './store.js';
import { escapeHtml, toast } from './utils.js';

const LINKED_USER_KEY = 'javaflow-cloud-user-v1';
const authState = { user: null, status: 'local', lastSyncAt: null, revision: null, initialized: false, syncing: false, recovery: false, accountReady: false };
let syncTimer = null;
let ignoreStoreChanges = false;
let dirtyGeneration = 0;
let retryTimer = null;

import { mergeProgress } from './progress-merge.js';

function hasProgress(state) {
  return Boolean(state.completedLessons?.length || state.examAttempts?.length || state.focusSessions?.length || state.english?.completedLessons?.length || state.english?.sessions?.length || state.english?.examAttempts?.length || state.english?.resourcesCompleted?.length || state.user?.totalAttempted || state.english?.totalAttempted);
}

async function requestCloud(method = 'GET', body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch('/api/progress', {
      method,
      credentials: 'same-origin',
      signal: controller.signal,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok && response.status !== 409) throw new Error(data.error || 'Não foi possível acessar a nuvem.');
    return { response, data };
  } finally {
    clearTimeout(timeout);
  }
}

async function uploadProgress(allowRetry = true) {
  if (!authState.user || !authState.accountReady || authState.syncing) return;
  const generation = dirtyGeneration;
  authState.syncing = true;
  authState.status = 'syncing';
  refreshAuthUI();
  try {
    const payload = { state: JSON.parse(store.export()), expectedRevision: authState.revision };
    const { response, data } = await requestCloud('PUT', payload);
    if (response.status === 409 && allowRetry && data.record?.state) {
      ignoreStoreChanges = true;
      try { store.import(JSON.stringify(mergeProgress(data.record.state, JSON.parse(store.export())))); }
      finally { ignoreStoreChanges = false; }
      window.dispatchEvent(new CustomEvent('javaflow:cloud-loaded'));
      authState.revision = data.record.revision;
      authState.syncing = false;
      return await uploadProgress(false);
    }
    if (!response.ok) throw new Error(data.error || 'Conflito de sincronização.');
    authState.revision = data.record.revision;
    authState.lastSyncAt = data.record.updatedAt;
    authState.status = generation === dirtyGeneration ? 'synced' : 'pending';
  } catch (error) {
    authState.status = navigator.onLine ? 'error' : 'offline';
    clearTimeout(retryTimer);
    retryTimer = setTimeout(() => { if (authState.user && navigator.onLine) uploadProgress(); }, 15000);
    if (allowRetry) console.warn('Sincronização adiada:', error.message);
  } finally {
    authState.syncing = false;
    refreshAuthUI();
    if (authState.user && authState.status === 'pending') { clearTimeout(syncTimer); syncTimer = setTimeout(() => uploadProgress(), 300); }
  }
}

async function loadAccountProgress(user) {
  authState.accountReady = false;
  authState.user = user;
  authState.status = 'syncing';
  refreshAuthUI();
  const linkedUser = localStorage.getItem(LINKED_USER_KEY);
  const { response, data } = await requestCloud();
  if (!response.ok) throw new Error(data.error || 'Falha ao carregar a conta.');
  const local = JSON.parse(store.export());
  authState.revision = data.record?.revision ?? null;
  let selected;
  if (data.record?.state) selected = linkedUser && linkedUser !== user.id ? data.record.state : mergeProgress(data.record.state, local);
  else if (linkedUser && linkedUser !== user.id) {
    ignoreStoreChanges = true;
    store.reset();
    ignoreStoreChanges = false;
    selected = JSON.parse(store.export());
  } else selected = local;

  selected.user = { ...selected.user, email: user.email ?? selected.user.email, name: user.name ?? selected.user.name };
  ignoreStoreChanges = true;
  store.import(JSON.stringify(selected));
  ignoreStoreChanges = false;
  window.dispatchEvent(new CustomEvent('javaflow:cloud-loaded'));
  localStorage.setItem(LINKED_USER_KEY, user.id);
  authState.accountReady = true;
  authState.syncing = false;
  await uploadProgress();
}

function scheduleSync() {
  if (!authState.user || !authState.accountReady || ignoreStoreChanges) return;
  dirtyGeneration += 1;
  clearTimeout(syncTimer);
  authState.status = 'pending';
  refreshAuthUI();
  syncTimer = setTimeout(() => uploadProgress(), 1200);
}

async function syncAccount() {
  try {
    if (!authState.user) return;
    if (!authState.accountReady) await loadAccountProgress(authState.user);
    else await uploadProgress();
  } catch {
    authState.status = navigator.onLine ? 'error' : 'offline';
    refreshAuthUI();
  }
}

function authError(error) {
  const message = String(error?.message ?? error).toLocaleLowerCase('pt-BR');
  if (message.includes('invalid login') || message.includes('invalid_grant') || message.includes('invalid credentials') || message.includes('email or password') || message.includes('password invalid') || message.includes('no user found')) return 'E-mail ou senha incorretos.';
  if (message.includes('not confirmed') || message.includes('confirm your email')) return 'Confirme seu e-mail antes de entrar. Confira também a caixa de spam.';
  if (message.includes('already registered') || message.includes('already exists')) return 'Este e-mail já possui uma conta.';
  if (message.includes('signup is disabled') || message.includes('signups not allowed')) return 'A criação de novas contas está temporariamente desativada.';
  if (message.includes('password should') || message.includes('password must') || message.includes('weak password') || message.includes('password length')) return 'Use uma senha com pelo menos 8 caracteres.';
  if (message.includes('identity') || message.includes('404')) return 'O serviço de contas ainda precisa ser ativado na Netlify.';
  return 'Não foi possível concluir. Verifique sua conexão e tente novamente.';
}

function renderAuthDialog(mode = 'login', message = '') {
  const root = document.getElementById('auth-dialog');
  const isSignup = mode === 'signup';
  const isReset = mode === 'reset';
  const isRecovery = mode === 'recovery';
  const title = isSignup ? 'Criar sua conta' : isReset ? 'Recuperar senha' : isRecovery ? 'Definir nova senha' : 'Entrar e sincronizar';
  const description = isSignup ? 'Seu progresso atual será salvo nesta conta.' : isReset ? 'Enviaremos um link seguro para o seu e-mail.' : isRecovery ? 'Escolha uma nova senha para continuar.' : 'Continue de onde parou em qualquer dispositivo.';
  root.hidden = false;
  root.innerHTML = `<div class="auth-backdrop" data-auth-close></div><section class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button class="icon-button auth-close" data-auth-close type="button" aria-label="Fechar">×</button><span class="auth-cloud">☁</span><h2 id="auth-title">${title}</h2><p>${description}</p>${message ? `<div class="auth-message">${escapeHtml(message)}</div>` : ''}<form id="auth-form" data-auth-form-mode="${mode}">${isSignup ? '<label>Seu nome<input class="input" name="name" autocomplete="name" required maxlength="60"></label>' : ''}${!isRecovery ? '<label>E-mail<input class="input" name="email" type="email" autocomplete="email" required></label>' : ''}${!isReset ? `<label>${isRecovery ? 'Nova senha' : 'Senha'}<input class="input" name="password" type="password" autocomplete="${isSignup ? 'new-password' : 'current-password'}" minlength="8" required></label>` : ''}<button class="button button-primary button-block" type="submit">${isSignup ? 'Criar conta' : isReset ? 'Enviar link' : isRecovery ? 'Salvar nova senha' : 'Entrar e sincronizar'}</button></form><div class="auth-links">${mode === 'login' ? '<button data-auth-mode="signup" type="button">Criar conta</button><button data-auth-mode="reset" type="button">Esqueci a senha</button>' : '<button data-auth-mode="login" type="button">Voltar para entrar</button>'}</div><small>Seus dados ficam vinculados à sua conta e mantêm uma cópia offline neste aparelho.</small></section>`;
  requestAnimationFrame(() => root.querySelector('input')?.focus());
}

async function handleAuthForm(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.matches('#auth-form')) return;
  const mode = form.dataset.authFormMode;
  const data = new FormData(form);
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Aguarde...';
  try {
    if (mode === 'signup') {
      const user = await signup(String(data.get('email')).trim(), String(data.get('password')), { full_name: String(data.get('name')).trim() });
      if (!user?.id || !user?.email) throw new Error('Resposta inválida do serviço de contas.');
      if (user.confirmedAt) await loadAccountProgress(user);
      else return renderAuthDialog('login', 'Conta criada. Abra o e-mail de confirmação e depois faça login.');
    } else if (mode === 'reset') {
      await requestPasswordRecovery(String(data.get('email')).trim());
      return renderAuthDialog('login', 'Link de recuperação enviado. Confira também a caixa de spam.');
    } else if (mode === 'recovery') {
      await updateUser({ password: String(data.get('password')) });
      authState.recovery = false;
      authState.user = await getUser();
      await loadAccountProgress(authState.user);
    } else {
      const user = await login(String(data.get('email')).trim(), String(data.get('password')));
      if (!user?.id) throw new Error('Resposta inválida do serviço de contas.');
      await loadAccountProgress(user);
    }
    document.getElementById('auth-dialog').hidden = true;
    toast(authState.status === 'synced' ? 'Conta conectada. Progresso sincronizado.' : 'Conta conectada; sincronização pendente.');
  } catch (error) {
    renderAuthDialog(mode, authError(error));
  }
}

export function openAuthDialog(mode = 'login') {
  if (authState.user && mode === 'login') return renderAccountDialog();
  renderAuthDialog(mode);
}

function renderAccountDialog() {
  const root = document.getElementById('auth-dialog');
  root.hidden = false;
  root.innerHTML = `<div class="auth-backdrop" data-auth-close></div><section class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button class="icon-button auth-close" data-auth-close type="button" aria-label="Fechar">×</button><span class="auth-cloud synced">✓</span><h2 id="auth-title">Sua conta e sincronização</h2><p>${escapeHtml(authState.user?.email ?? 'Conta conectada')}</p><div class="account-actions"><button class="button button-primary button-block" data-auth-sync type="button">Sincronizar agora</button><button class="button button-ghost button-block" data-auth-logout type="button">Sair da conta</button></div><small>A cópia local permanece disponível offline. Ao entrar novamente, ela será comparada com a versão da nuvem.</small></section>`;
}

async function signOut() {
  clearTimeout(syncTimer);
  await uploadProgress();
  clearTimeout(retryTimer);
  await logout();
  authState.user = null;
  authState.accountReady = false;
  authState.revision = null;
  authState.status = 'local';
  document.getElementById('auth-dialog').hidden = true;
  refreshAuthUI();
  toast('Você saiu. O progresso continua salvo localmente.');
}

export function refreshAuthUI() {
  const button = document.getElementById('account-button');
  if (!button) return;
  const statusLabel = { syncing: 'Sincronizando', pending: 'Salvando', synced: 'Sincronizado', error: 'Tentar novamente', offline: 'Modo offline', local: 'Entrar' }[authState.status] ?? 'Entrar';
  button.classList.toggle('connected', Boolean(authState.user));
  button.querySelector('span:first-child').textContent = authState.user ? (authState.status === 'synced' ? '✓' : '☁') : '☁';
  button.querySelector('span:last-child').textContent = statusLabel;
  button.title = authState.user ? `${authState.user.email ?? 'Conta conectada'} · ${statusLabel}` : 'Entrar para sincronizar entre dispositivos';
  document.querySelectorAll('[data-cloud-summary]').forEach((element) => { element.textContent = authState.user ? `${statusLabel} com ${authState.user.email ?? 'sua conta'}.` : 'Entre para acessar o mesmo progresso em outros dispositivos.'; });
  document.querySelectorAll('[data-cloud-action]').forEach((element) => { element.textContent = authState.user ? 'Gerenciar conta' : 'Entrar e proteger progresso'; });
}

export async function initAuth() {
  if (authState.initialized) return;
  authState.initialized = true;
  document.addEventListener('click', async (event) => {
    if (event.target.closest('[data-auth-open]')) authState.user ? renderAccountDialog() : renderAuthDialog('login');
    if (event.target.closest('[data-auth-close]')) document.getElementById('auth-dialog').hidden = true;
    const mode = event.target.closest('button[data-auth-mode]')?.dataset.authMode;
    if (mode) renderAuthDialog(mode);
    if (event.target.closest('[data-auth-sync]')) { document.getElementById('auth-dialog').hidden = true; await syncAccount(); toast(authState.status === 'synced' ? 'Sincronização concluída.' : 'Ainda não sincronizou. Sua cópia local está preservada.', authState.status === 'synced' ? 'success' : 'error'); }
    if (event.target.closest('[data-auth-logout]')) await signOut();
  });
  document.getElementById('auth-dialog').addEventListener('submit', handleAuthForm);
  store.subscribe(scheduleSync);
  window.addEventListener('online', () => authState.user && syncAccount());
  try {
    const callback = await handleAuthCallback();
    if (callback?.type === 'recovery') authState.recovery = true;
    const user = callback?.user ?? await getUser();
    if (user) await loadAccountProgress(user);
    if (authState.recovery) renderAuthDialog('recovery');
  } catch (error) {
    console.warn('Conta indisponível:', error.message);
  }
  refreshAuthUI();
}
