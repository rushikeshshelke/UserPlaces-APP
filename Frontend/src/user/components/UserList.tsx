import "./UserList.css";
import "../../App.css";
import UserItem from "./UserItem";
import Card from "../../shared/Components/UIElements/Card";

const UserList = (props: any) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found!!!</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="list-group users-list">
      {props.items.map((user: any) => {
        return (
          <UserItem
            key={user._id}
            id={user._id}
            name={user.name}
            image={user.image}
            placeCount={user.places.length}
          ></UserItem>
        );
      })}
    </ul>
  );
};

export default UserList;
