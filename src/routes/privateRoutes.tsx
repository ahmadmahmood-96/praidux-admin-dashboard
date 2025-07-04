import { Outlet, Navigate } from 'react-router-dom';
import { UseAuthentication } from '../utils/useAuthentication';
import { useLocation } from 'react-router-dom';

const PrivateRoutes = () => {
     const location = useLocation();
    const currentUrl = location.pathname;
    const { JWT } = UseAuthentication ();
    //console.log(JWT)
    return(
        JWT ? <Outlet /> : currentUrl != '/get-quotation' && <Navigate to="/login" replace />
    )
}
const PublicRoutes = () => {
     const location = useLocation();
    const currentUrl = location.pathname;
    const { JWT } = UseAuthentication ();
    //console.log(JWT)
    return(
        !JWT ? <Outlet /> : currentUrl != '/get-quotation' && <Navigate to="/" replace />
    )
}

export { PrivateRoutes,PublicRoutes }
