import styles from "./UserTag.module.css";

export interface User {
  _id: string;
  name: string;
  profilePictureUrl?: string;
}

interface UserTagProps {
  user?: User | null;
  className?: string;
}

export function UserTag({ user, className }: UserTagProps) {
  const profilePictureSrc = user?.profilePictureUrl || "/userDefault.svg";
  const displayName = user ? user.name : "Not Assigned";

  return (
    <div className={`${styles.userTag} ${className || ""}`}>
      <img className={styles.profilePicture} src={profilePictureSrc} alt={displayName} />
      <span className={styles.name}>{displayName}</span>
    </div>
  );
}
