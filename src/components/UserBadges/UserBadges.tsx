import { Badge } from 'reactstrap';
import { User } from '../../openapi/gencode';
import styles from './UserBadges.module.scss';

export interface UserBadgesProps {
  users: User[];
  onBadgeClicked: (userId: number) => void;
  selectedUserId?: number;
}

export const UserBadges: React.FC<UserBadgesProps> = (props) => {
  const { users, onBadgeClicked, selectedUserId } = props;

  return (
    <div className={styles.container}>
      {users.map((user) => (
        <Badge
          pill={true}
          color={user.id === selectedUserId ? 'primary' : 'success'}
          key={user.id}
          onClick={() => onBadgeClicked(user.id)}
          className={styles.container__badge}
        >
          {user.username}
        </Badge>
      ))}
    </div>
  );
};
