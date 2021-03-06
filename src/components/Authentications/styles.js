import {
  styled,
  Grid,
  Box,
  TextField,
  Button,
  ButtonBase,
  Paper,
  FormControl,
  Container,
  InputLabel,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { COLOR_APP, COLOR_APP_HOVER } from '@/config/dataProperties';
import { devices } from '@/config/devices';

import { Link } from 'react-router-dom';

export const GridPresentation = styled(Grid)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  minHeight: '100vh',
  width: '100vw',
  color: '#fff',
  fontWeight: 700,
  backgroundColor: '#8a05be', /* fallback for old browsers */
  background: 'linear-gradient(+40deg, rgb(169, 78, 249), rgb(116, 29, 150))', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  padding: '0px 15px',
  '& h1': {
    textAlign: 'center',
  },
  '& h2': {
    fontSize: '1.2rem',
    textAlign: 'center',
  },
  '& img': {
    width: '250px',
    margin: '2.5rem 0',
  },
  '& button': {
    margin: '0.6rem',
  },
});

export const AuthSection = styled(Paper)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
});

export const RedeemAccountContainer = styled(Container)({
  backgroundColor: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: (props) => (props.option === 'menu' || props.response ? 'center' : 'flex-start'),
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '100%',
  padding: 24,
  color: '#000',
  margin: 0,
});

export const RedeemAccountFormControl = styled(FormControl)({
  [devices.mobileLarge]: {
    paddingBottom: (props) => (props.option !== 'menu' ? 100 : 0),
  },
});

export const RedeemAccountTextField = styled(TextField)({
  margin: '5px 0',
});

export const LogoArea = styled(Box)({
  height: (props) => (props.error ? '26%' : '40%'),
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  marginBottom: 15,
  [devices.mobileLarge]: {
    height: (props) => (props.error ? '10% !important' : '30% !important'),
  },
  '& .logo-img': {
    width: '270px',
    [devices.mobileLarge]: {
      width: '195px',
    },
  },
});

export const FormArea = styled(Box)({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  '& form': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '60%',
    padding: '25px',
  },
});

export const AuthLabel = styled(InputLabel)({
  width: '65%',
  [devices.tablet]: {
    width: '100%',
  },
});

export const AuthTextField = styled(TextField)({
  width: '65%',
  margin: '0.8rem 0 1.5rem 0',
  [devices.tablet]: {
    width: '100%',
  },
});

export const CustomFormControl = styled(FormControl)({
  width: '65%',
  margin: '0.8rem 0',
  [devices.tablet]: {
    width: '100%',
  },
});

export const SpecialButton = styled(Button)({
  display: 'none',
  [devices.laptop]: {
    display: 'block',
  },
});

export const SubmitArea = styled(Grid)({
  width: '65%',
  margin: '2rem 0 0.5rem 0',
  [devices.tablet]: {
    width: '100%',
  },
});

export const CustomAlert = styled(Alert)({
  width: '52%',
  margin: '0.8rem 0',
  [devices.tablet]: {
    width: '80%',
  },
});

export const CustomButtonBase = styled(ButtonBase)({
  backgroundColor: COLOR_APP,
  color: '#fff',
  '&:hover': {
    backgroundColor: COLOR_APP_HOVER,
  },
  marginBottom: '10px',
  fontSize: '1rem',
  fontWeight: 100,
  padding: 10,
  borderRadius: 4,
  width: (props) => (props.fullwidth === 'true' ? '100%' : 'auto'),
  '& .MuiCircularProgress-root': {
    marginRight: '5px',
  },
  '& .MuiIcon-root': {
    marginRight: '5px',
  },
});

export const CustomLink = styled(Link)({
  textDecoration: 'none',
});
