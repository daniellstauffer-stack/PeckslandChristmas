import { supabasePublishableKey, supabaseUrl } from "./supabase-config.js";

const login = document.querySelector("#login");
const form = document.querySelector("#login-form");
const email = document.querySelector("#email");
const sendLink = document.querySelector("#send-link");
const status = document.querySelector("#status");
const retryLoad = document.querySelector("#retry-load");
const loginSignOut = document.querySelector("#login-sign-out");
const planner = document.querySelector("#planner-shell");
const frame = document.querySelector("#planner-frame");
const sessionEmail = document.querySelector("#session-email");
const signOut = document.querySelector("#sign-out");

function start() {
  if (!supabaseUrl || !supabasePublishableKey) {
    status.textContent = "Sign-in has not been configured. Contact the host for access.";
    return;
  }
  if (!window.supabase) {
    status.textContent = "Sign-in is unavailable. Reload the page to try again.";
    return;
  }

  let client;
  try {
    client = window.supabase.createClient(supabaseUrl, supabasePublishableKey);
  } catch {
    status.textContent = "The sign-in settings could not be loaded. Contact the host.";
    return;
  }

  const { auth } = client;
  const pageUrl = new URL(window.location.href);
  const hash = new URLSearchParams(pageUrl.hash.slice(1));
  const linkFailed = pageUrl.searchParams.has("error") || hash.has("error");
  const redirectTo = new URL(pageUrl.pathname, pageUrl.origin).href;
  let user = null;
  let loadRequest = null;
  let initialSessionReceived = false;
  let signingOut = false;

  function closePlanner() {
    loadRequest?.abort();
    loadRequest = null;
    planner.hidden = true;
    login.hidden = false;
    frame.removeAttribute("srcdoc");
    delete frame.dataset.plannerUser;
    sessionEmail.textContent = "";
  }

  async function openPlanner() {
    closePlanner();
    const request = new AbortController();
    loadRequest = request;
    const account = user;
    retryLoad.hidden = true;
    loginSignOut.hidden = false;
    status.textContent = "Opening the family planner…";
    try {
      const { data, error } = await client.storage.from("pecksland-private")
        .download("planner.html", {}, { cache: "no-store", signal: request.signal });
      if (error) throw error;
      const html = await data.text();
      if (request.signal.aborted) return;
      frame.dataset.plannerUser = account.id;
      frame.srcdoc = html;
      sessionEmail.textContent = account.email || "Signed in";
      planner.hidden = false;
      login.hidden = true;
    } catch {
      if (request.signal.aborted) return;
      status.textContent = "The planner could not be opened. Try again, or ask the host to check access for this email.";
      retryLoad.hidden = false;
    }
  }

  function showSignIn(message = "") {
    closePlanner();
    form.hidden = false;
    loginSignOut.hidden = true;
    retryLoad.hidden = true;
    status.textContent = message;
  }

  auth.onAuthStateChange((_event, session) => {
    const firstSession = !initialSessionReceived;
    initialSessionReceived = true;
    const previousUserId = user?.id;
    user = session?.user ?? null;

    if (firstSession && linkFailed) {
      history.replaceState(history.state, "", redirectTo);
    }
    if (signingOut) return;

    if (!user) {
      if (firstSession || previousUserId) {
        showSignIn(linkFailed && firstSession ? "That sign-in link could not be used. Request a new one below." : "");
      }
      return;
    }

    if (user.id !== previousUserId) {
      form.hidden = true;
      // Auth callbacks run while the SDK holds its session lock.
      setTimeout(() => {
        if (user && !signingOut && !loadRequest) void openPlanner();
      }, 0);
      closePlanner();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    sendLink.disabled = true;
    status.textContent = "Requesting a sign-in link…";
    try {
      await auth.signInWithOtp({
        email: email.value.trim(),
        options: { shouldCreateUser: false, emailRedirectTo: redirectTo }
      });
    } catch {
      // Use the same response for invited and unknown addresses.
    } finally {
      sendLink.disabled = false;
    }
    if (!user) {
      status.textContent = "If this address has access, a sign-in link should arrive shortly. Check your spam folder if you don’t see it.";
    }
  });

  async function leavePlanner() {
    signingOut = true;
    closePlanner();
    form.hidden = true;
    retryLoad.hidden = true;
    loginSignOut.hidden = false;
    loginSignOut.disabled = true;
    status.textContent = "Signing out…";
    try {
      const { error } = await auth.signOut({ scope: "local" });
      if (error) throw error;
      user = null;
      showSignIn("You’re signed out.");
      email.focus();
    } catch {
      status.textContent = "Sign-out did not finish. Try again.";
    } finally {
      loginSignOut.disabled = false;
      signingOut = false;
    }
  }

  retryLoad.addEventListener("click", () => void openPlanner());
  signOut.addEventListener("click", () => void leavePlanner());
  loginSignOut.addEventListener("click", () => void leavePlanner());
}

start();
