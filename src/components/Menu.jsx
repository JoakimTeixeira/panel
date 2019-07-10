import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Avatar from 'react-avatar'

import {AppBar, Toolbar, useScrollTrigger, Slide,
    IconButton, Menu, MenuItem, Drawer, List, ListItem,
    useMediaQuery, Icon} from '@material-ui/core'
    
import Logo from '../assets/estudante_ti1.png'
import LogoHorizontal from '../assets/estudante_ti4.png'

import { styles } from './styles/Menu'

const HideOnScroll = props => {
    const {children, window} = props

    const trigger = useScrollTrigger({target: window ? window() : undefined})

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    )
}

const useStyles = makeStyles(styles)

const MenuApp = props => {
    const classes = useStyles()
    const matches = useMediaQuery('(min-width: 820px)')

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const openMyAccountIcon = e => {
        setAnchorEl(e.currentTarget)
    }

    const closeMyAccountIcon = () => {
        setAnchorEl(null)
    }

    const logout = () => {
        localStorage.removeItem('user')
        window.location.href = "/auth"
    }

    const [state, setState] = React.useState({
        drawerMenu: false
    })

    return (
        <div className={props.user._id ? "" : classes.hide}>
            <HideOnScroll {...props}>
                <AppBar className={classes.menu}>
                    <Toolbar>
                        { !matches && 
                            <IconButton onClick={() => setState({drawerMenu: true})} 
                                edge="start" className={classes.menuButton}
                                color="inherit" aria-label="Menu"
                            >
                                <Icon>menu</Icon>
                            </IconButton>
                        }
                        <Link className={classes.link} to="/stats">
                            <img src={LogoHorizontal} width="180"
                                className={classes.menuLogo}
                                alt="Estudante TI"
                            />
                        </Link>
                        { matches && 
                            <Link to="/articles" className={classes.menuLink}>
                                <span className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        library_books
                                    </Icon>
                                    Artigos
                                </span>
                            </Link>
                        }
                        { matches && 
                            <Link to="/users" className={classes.menuLink}>
                                <span className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        person_outline
                                    </Icon>
                                    Usuários
                                </span>
                            </Link>
                        }
                        { matches && 
                            <Link to="/management" className={classes.menuLink}>
                                <span className={classes.menuButtonContent}>
                                    <Icon className={classes.iconButtonMenu}>
                                        settings
                                    </Icon>
                                    Configurações
                                </span>
                            </Link>
                        }
                    </Toolbar>
                    <div>
                        { props.user && props.user.name ?
                            <div className={classes.menuButton}>
                                <Avatar onClick={openMyAccountIcon} 
                                    style={{cursor: 'pointer'}} color="#888"
                                    size="50" round="30px" name={props.user.name}
                                />
                            </div> : '' 
                        }
                        <Menu
                            id="my-account-menu"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={open}
                            onClose={closeMyAccountIcon}>
                            
                            <MenuItem>
                                <span className={classes.menuButtonContent}>
                                    <Icon className={classes.iconButtonMenu}>
                                        person_outline
                                    </Icon>
                                    Meus dados
                                </span>
                            </MenuItem>
                            <MenuItem>
                                <span className={classes.menuButtonContent}>
                                    <Icon className={classes.iconButtonMenu}>
                                        library_books
                                    </Icon>
                                    Meus artigos
                                </span>
                            </MenuItem>
                            <MenuItem onClick={logout}>
                                <span className={classes.menuButtonContent}>
                                    <Icon className={classes.iconButtonMenu}>
                                        exit_to_app
                                    </Icon>
                                    Sair
                                </span>
                            </MenuItem>
                        </Menu>
                    </div>
                </AppBar>
            </HideOnScroll>
            <Drawer open={state.drawerMenu} 
                onClose={() => setState({drawerMenu: false  })}
            >
                <Link to="/stats" onClick={() => setState({drawerMenu: false})}>
                    <div className={classes.logo}>
                        <img src={Logo} width="180" alt="Estudante TI"/>
                    </div>
                </Link>
                <div className={classes.drawer}>
                    <List className={classes.list}>
                        <Link to="/articles" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button key={'articles'} 
                                className={classes.drawerButton}
                            >
                                <span className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        library_books
                                    </Icon>
                                    Artigos
                                </span>
                            </ListItem>
                        </Link>
                        <Link to="/users" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button key={'users'} 
                                className={classes.drawerButton}
                            >
                                <span className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        person_outline
                                    </Icon>
                                    Usuários
                                </span>
                            </ListItem>
                        </Link>
                        <Link to="/management" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button key={'stats'}
                                className={classes.drawerButton}
                            >
                                <span className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        settings
                                    </Icon>
                                    Configurações
                                </span>
                            </ListItem>
                        </Link>
                    </List>
                    <List className={classes.list}>
                        <ListItem button onClick={logout} 
                            className={classes.drawerButton}
                        >
                            <span className={classes.menuButtonContent}>
                                <Icon  className={classes.iconButtonMenu}>
                                    exit_to_app
                                </Icon>
                                Sair
                            </span>
                        </ListItem>
                    </List>
                </div>  
            </Drawer>
        </div>
        )
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(MenuApp)