
const routes = [
    {
        path: '/',
        component: () => import('layouts/CustomLayout.vue'),
        children: [
            { path: '', component: () => import('pages/PropPage.vue') },
            { path: 'DraftGameTwo', component: () => import('pages/DraftGame2.vue') },
            { path: 'DraftGame3', component: () => import('pages/DraftGame3.vue') }
        ]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
];

export default routes;
