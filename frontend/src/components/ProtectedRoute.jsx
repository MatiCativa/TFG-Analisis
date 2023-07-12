import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({user, children, redirectTo='/landing'}) => {
    if(!user.token) {
        return <Navigate to={redirectTo}/>
    }
    return children 
}