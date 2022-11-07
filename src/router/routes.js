
const routes = [
    {
        path: '/',
        component: () => import('layouts/CustomLayout.vue'),
        children: [
            { path: '', component: () => import('pages/PropPage.vue') },
            { path: 'DraftGame', component: () => import('pages/DraftGame.vue') }
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
