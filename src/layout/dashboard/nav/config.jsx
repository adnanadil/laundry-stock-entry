// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Upload Image',
    path: '/Upload',
    icon: icon('ic_PDP'),
  },
  {
    title: 'Semi Annual Merit Increase',
    // path: '/dashboard/SAMI',
    path: '/SAMI',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Interview Assessment',
    path: '/Interview-Assessment',
    // path: '/dashboard/Interview-Assessment',
    icon: icon('ic_interview'),
  }
];

export default navConfig;
