import Avatar from "../../shared/Components/UIElements/Avatar";
import Card from "../../shared/Components/UIElements/Card";
import "./UserItem.css";
import { Link } from "react-router-dom";

interface UserItemProps {
  id: string;
  name: string;
  image: string;
  placeCount: number;
}

const UserItem = ({ id, name, image, placeCount }: UserItemProps) => {
  return (
    <li className="list-group-item user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar
              image={`${import.meta.env.VITE_APP_BACKEND_URL}/${image}`}
              alt={name}
            ></Avatar>
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {placeCount} {placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
