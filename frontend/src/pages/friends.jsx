import React, { useEffect, useState } from "react";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("/api/users/friends", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setFriends(data);
        else console.error(data.message);
      } catch (error) {
        console.error("Error fetching friends", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friendId) => {
    try {
      const res = await fetch(`/api/users/remove/${friendId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert("Friend removed successfully");
        setFriends((prev) => prev.filter((f) => f._id !== friendId));
      } else {
        alert(data.message || "Failed to remove friend");
      }
    } catch (error) {
      console.error("Remove friend error", error);
      alert("Error removing friend");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
      {friends.length === 0 ? (
        <p>No friends found. Go send some requests!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="bg-white p-4 rounded shadow flex flex-col items-start gap-2"
            >
              <div className="flex items-center gap-4 w-full">
                <img
                  src={friend.profilePic || "/default-avatar.png"}
                  alt={friend.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{friend.fullName}</p>
                  <p className="text-sm">
                    {friend.nativeLanguage} ➝ {friend.learningLanguage}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1 border rounded">Message</button>
                <button
                  onClick={() => handleRemoveFriend(friend._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove Friend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
