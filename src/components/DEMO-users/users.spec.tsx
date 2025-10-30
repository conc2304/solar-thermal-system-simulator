import { render, screen } from '@testing-library/react';
import Users from './users';

describe('User', () => {
  test('renders heading', async () => {
    render(<Users />);
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
  });

  test('renders a list of users', async () => {
    render(<Users />);
    const users = await screen.findAllByRole('listitem');
    expect(users).toHaveLength(2);
  });

  describe('failure conditions', () => {
    test('does not render non-existent heading', () => {
      render(<Users />);
      expect(
        screen.queryByRole('heading', { name: 'Non-existent Heading' })
      ).not.toBeInTheDocument();
    });

    test('does not render more than 2 users', async () => {
      render(<Users />);
      const users = await screen.findAllByRole('listitem');
      expect(users).not.toHaveLength(3);
      expect(users).not.toHaveLength(10);
    });

    test('does not render less than 2 users', async () => {
      render(<Users />);
      const users = await screen.findAllByRole('listitem');
      expect(users).not.toHaveLength(0);
      expect(users).not.toHaveLength(1);
    });

    test('does not render a table element', () => {
      render(<Users />);
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    test('does not render a button', () => {
      render(<Users />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('heading text does not match incorrect values', () => {
      render(<Users />);
      expect(
        screen.queryByRole('heading', { name: 'User' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'USERS' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'users' })
      ).not.toBeInTheDocument();
    });
  });
});
