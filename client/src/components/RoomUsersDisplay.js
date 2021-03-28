import { Fragment } from "react";
import { ListGroup } from "react-bootstrap";

const RoomUsersDisplay = ({ user, usersInRoom, maxUsersShown }) => {
  // helper functions
  const getShownUsersInRoom = () => {
    return usersInRoom.filter((userInRoom, index) => index < maxUsersShown);
  };

  const displayCountOfAdditionalUsersInRoom = () => {
    let usersInRoomCount = usersInRoom.length;
    let extraPlayersInRoom = usersInRoomCount - maxUsersShown;

    return (
      <ListGroup.Item className="d-flex flex-row text-truncate">
        And {extraPlayersInRoom} other player
        {extraPlayersInRoom === 1 ? "" : "s"}...
      </ListGroup.Item>
    );
  };

  const displayDrawerIndicator = () => {
    return (
      <div className="current-drawer-indicator d-flex flex-column justify-content-start align-items-end">
        <i className="las la-2x la-pen"></i>
      </div>
    );
  };

  // complete commented out JSX elements in template when game logic is done (points, player ranking, current drawer)

  return (
    <div className="roomUsersDisplayWrapper">
      {/* <ListGroup.Item className="d-flex flex-row text-truncate font-weight-bold text-uppercase bg-secondary text-light">
        Players ({usersInRoom.length})
      </ListGroup.Item> */}
      {getShownUsersInRoom(usersInRoom, maxUsersShown).map(
        (userInRoom, index) => {
          return (
            <ListGroup.Item
              key={index}
              className={`d-flex flex-row justify-content-between userCard ${
                userInRoom.sessionID === user.sessionID
                  ? "userCard--isUser"
                  : ""
              }`}
            >
              <div className="d-flex flex-row">
                {/* <div className="userCardRank">#1</div> */}
                <div
                  className={`userCardNameAndPoints ${
                    userInRoom.isAuthenticated ? "authUser" : ""
                  }`}
                >
                  <div className="font-weight-bold text-truncate">
                    {userInRoom.sessionID === user.sessionID
                      ? `You (${userInRoom.displayName})`
                      : userInRoom.displayName}
                  </div>
                  <div className="text-truncate text-end">
                    {userInRoom.points} Points
                  </div>
                </div>
              </div>
              {userInRoom.isDrawer && displayDrawerIndicator()}
            </ListGroup.Item>
          );
        }
      )}

      {usersInRoom.length > maxUsersShown
        ? displayCountOfAdditionalUsersInRoom()
        : ""}
    </div>
  );
};

export default RoomUsersDisplay;
