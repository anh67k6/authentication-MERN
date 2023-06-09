import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import SideBar from "./SideBar";
import { Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import { AddDirectConversation, UpdateDirectConversation } from "../../redux/slices/conversation";
import { SelectConversation } from "../../redux/slices/app";

const DashboardLayout = () => {
  const dispatch = useDispatch()

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const user_id = window.localStorage.getItem("user_id")
  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      }

      // window.onload()

      if (!socket) {
        connectSocket(user_id)
      }
      socket.on("new_friend_request", (data) => {
      })
      socket.on("start_chat", (data) => {
        const existing_conversation = conversations.find((el) => el.id === data._id)
        if (existing_conversation) {
          dispatch(UpdateDirectConversation({ conversation: data }))
        } else {
          dispatch(AddDirectConversation({ conversation: data }))
        }
        dispatch(SelectConversation({ room_id: data._id }))
      })
    }
    return () => {
      socket?.off("new_friend_request")
      socket?.off("request_accepted")
      socket?.off("request_sent")
      socket?.off("start_chat")
    }
  }, [isLoggedIn, socket])

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />
  }


  return (
    <>
      <Stack direction={"row"}>
        <SideBar />
        <Outlet />
      </Stack>
    </>
  );
};

export default DashboardLayout;
