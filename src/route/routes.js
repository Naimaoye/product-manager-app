import { Signin } from '../pages/signin/components/Sigin';
import { Signup } from '../pages/signup/components/Signup';
import { Dashboard } from '../pages/dashboard/components/Dashboard';

export const Routes = [
    {
        component: Signup,
        exact: true,
        path: '/',
        protected: false,
    },
    {
        component: Signin,
        exact: true,
        path: '/login',
        protected: false,
    },
    {
        component: Dashboard,
        exact: true,
        path: '/dashboard',
        protected: false,
    },
]