import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { AppRoute } from '../../routes';
import styles from './Navigation.module.scss';

export const AppNavigation: React.FC = () => {
  return (
    <div className={styles.container}>
      <Link to={AppRoute.Start}>
        <Button color="secondary">/</Button>
      </Link>
      <Link to={AppRoute.Users}>
        <Button color="success">User posts</Button>
      </Link>
      <Link to={AppRoute.Posts}>
        <Button color="warning">Posts search</Button>
      </Link>
    </div>
  );
};
