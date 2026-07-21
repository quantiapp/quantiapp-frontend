import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private client: SupabaseClient;

  session = signal<Session | null>(null);
  currentUser = signal<User | null>(null);

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    this.initSession();
  }

  get supabaseClient(): SupabaseClient {
    return this.client;
  }

  private async initSession(): Promise<void> {
    const { data } = await this.client.auth.getSession();
    this.session.set(data.session);
    this.currentUser.set(data.session?.user ?? null);

    this.client.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      this.session.set(session);
      this.currentUser.set(session?.user ?? null);
    });
  }

  async getAccessToken(): Promise<string | null> {
    const sess = this.session();
    if (sess?.access_token) {
      return sess.access_token;
    }
    const { data } = await this.client.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async signInWithPassword(email: string, password: string) {
    return await this.client.auth.signInWithPassword({ email, password });
  }

  async signUpWithPassword(email: string, password: string, name?: string) {
    return await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    });
  }

  async signInWithGoogle() {
    return await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/secure/dashboard'
      }
    });
  }

  async resetPasswordForEmail(email: string) {
    return await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth/reset-password'
    });
  }

  async updatePassword(newPassword: string) {
    return await this.client.auth.updateUser({ password: newPassword });
  }

  async signOut() {
    return await this.client.auth.signOut();
  }
}
