import "./PlaceList.css";
import "../../App.css";
import Card from "../../shared/Components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/Components/FormElements/Button";

const PlaceList = (props: any) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>Its lonely here!!! Create new one?</h2>
          <Button to="/places/new">Create Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place: any) => {
        return (
          <PlaceItem
            key={place._id}
            id={place._id}
            name={place.name}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            createdBy={place.createdBy}
            coordinates={place.location}
            onDelete={props.onDeletePlace}
          ></PlaceItem>
        );
      })}
    </ul>
  );
};

export default PlaceList;
