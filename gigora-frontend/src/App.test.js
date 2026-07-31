import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Supabase client to prevent network authentication calls during testing
jest.mock('./supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

test('renders Gigora welcome branding on initial auth gate', async () => {
  render(<App />);
  const welcomeElement = await screen.findByText(/Welcome to Gigora/i);
  expect(welcomeElement).toBeInTheDocument();
});