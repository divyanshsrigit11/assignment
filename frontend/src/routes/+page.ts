import { redirect } from '@sveltejs/kit';

export function load() {
    // Automatically send users to login when they hit the home page
    throw redirect(307, '/login');
}

