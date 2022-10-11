import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import { Navbar, NavbarBrand, Nav, NavDropdown, Button } from 'react-bootstrap'
import { IoPersonCircleOutline, IoSettingsOutline, IoLogOutOutline, IoGridOutline, IoMenu, IoClose } from 'react-icons/io5'
import { logout } from '../utils/auth'


const AppLink = ({ path, children, handleLogout = undefined }) => {
  return <NavLink 
            to={path} 
            className="nav-link"
            onClick={handleLogout}
          >
            {children}
          </NavLink>
}



const MobileNavigationMenu = ({ show, closeMenu }) => {
  const dispatch = useDispatch()
  const [pages, setPages] = useState([])
  const { token, user: { _id, role } } = useSelector(state => state.auth)


  const links = useMemo(() => {
    return [
      { id: 1, path: '/auth/login', text: 'Login' },
      { id: 2, path: '/auth/register', text: 'Register' },
      { id: 3, path: '/profile', text: 'Profile' },
      { id: 4, path: '/categories', text: 'Categories' },
      { id: 5, path: '/add-post', text: 'Add Post' },
      { id: 6, path: '/my-posts', text: 'My Posts' },
      { id: 7, path: '/settings', text: 'Settings' },
      { id: 8, path: '/auth/login', text: 'Logout', cb: () => dispatch(logout()) }
    ]
  }, [dispatch])


  useEffect(() => {
    if(token && _id) {
      setPages(links.slice(2).filter(i => i.path !== '/categories'))

      role === 'admin' && setPages(links.slice(2))
    }
    else {
      setPages(links.slice(0, 2))
    }
  }, [token, _id, role, links])


  return (
    <div 
      className={
        `
          mobile-navigation-menu 
          ${show ? 'show' : ''}
        `
      }
    >
      <Nav>
        {
          pages.map(link => {
            return <AppLink 
                      key={link.id}
                      path={link.path} 
                      handleLogout={link?.cb}
                    >
                      <span onClick={closeMenu}>{link.text}</span>
                    </AppLink>
          })
        }
      </Nav>
    </div>
  )
}



const AppNavbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isShowMenu, setShowMenu] = useState(false)
  const { width } = useSelector(state => state.windowSize)
  const { token, user: { _id, role, avatar, fullname } } = useSelector(state => state.auth)


  const handleCloseMenu = () => setShowMenu(false)


  return (
    <>
      <Navbar variant="dark" bg="dark" expand="md" className="fixed-top">
        <NavbarBrand 
          onClick={() => {
            navigate('/')
            handleCloseMenu()
          }}
        > 
          Blog App
        </NavbarBrand>

        {
          width > 768
            ? <Navbar.Collapse id="navbar-menu">
                <Nav>
                  {
                    token && _id
                      ? <>
                          {
                            role === 'admin' && <AppLink path="/categories">Categories</AppLink> 
                          }

                          <AppLink path="/add-post">Add Post</AppLink> 

                          <NavDropdown
                            title={
                              <img 
                                alt={fullname}
                                className="user-avatar"
                                src={avatar || process.env.REACT_APP_DEFAULT_AVATAR}
                              />
                            }
                            menuVariant="dark"
                          >
                          
                            <NavDropdown.Item as="li">
                              <AppLink path="/profile">
                                <IoPersonCircleOutline /> 
                                <span>My Profile</span>
                              </AppLink> 
                            </NavDropdown.Item>

                            <NavDropdown.Item as="li">
                              <AppLink path="/my-posts">
                                <IoGridOutline />
                                <span>My Posts</span>
                              </AppLink>
                            </NavDropdown.Item>

                            <NavDropdown.Item as="li">
                              <AppLink path="/settings">
                                <IoSettingsOutline />
                                <span>Settings</span>
                              </AppLink>
                            </NavDropdown.Item>

                            <NavDropdown.Item as="li">
                              <AppLink
                                path="/auth/login"
                                handleLogout={() => dispatch(logout())}
                              >
                                <IoLogOutOutline />
                                <span>Logout</span>
                              </AppLink>
                            </NavDropdown.Item>
                          </NavDropdown>
                        </>
                      
                      : <>
                          <AppLink path="/auth/login">Login</AppLink>
                          <AppLink path="/auth/register">Register</AppLink>
                        </>
                  }
                </Nav>
              </Navbar.Collapse>
            
            : <Button
                id="toggleMenu"
                variant="light"
                onClick={() => setShowMenu(!isShowMenu)}
              >
                { isShowMenu ? <IoClose /> : <IoMenu /> }
              </Button>
        }
      </Navbar>

      {
        width <= 768 && <MobileNavigationMenu show={isShowMenu} closeMenu={handleCloseMenu} />
      }
    </>
  )
}


export default AppNavbar