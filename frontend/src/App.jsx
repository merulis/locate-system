import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import AuthProvider from '../components/auth_component/AuthProvider.jsx';
import Layout from '../pages/Layout'
import Home from '../pages/Home'
import Error from '../pages/Error.jsx'
import MapComponent from '../components/map_component/MapComponent'
import Sign_in from '../components/auth_component/Sign_in.jsx'
import Sign_up from '../components/auth_component/Sign_up.jsx'
import ProtectedRoute from '../components/auth_component/ProtectedRoute.jsx'

import AdminLayout from '../pages/admin/AdminLayout.jsx'
import AdminRoute from '../pages/admin/AdminRoute.jsx'
import BeaconPage from '../pages/admin/beacons/BeaconPage.jsx';
import CreateBeacon from '../pages/admin/beacons/BeaconCreateForm.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/map',
        element:
          <ProtectedRoute>
            <MapComponent />
          </ProtectedRoute>,
      },
      {
        path: '/sign_in',
        element: <Sign_in />,
      },
      {
        path: '/sign_up',
        element: <Sign_up />,
      },
    ],
  },
  {
    path: '/admin',
    element:
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>,
      children: [
        {
          path: '/admin/beacons',
          element: <BeaconPage/>,
          children: [
            {
              path:'admin/beacons/create',
              element: <CreateBeacon />
            }
          ]
        }
      ]
  }
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    </AuthProvider>

  )
}

export default observer(App)