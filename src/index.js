import io from "socket.io-client"
import $ from "jquery";
import axios from "axios";

let Name;
const API_URL = 'http://localhost:3000';
const socket = io.connect(API_URL, {transports: ['websocket', 'polling', 'flashsocket']})


axios.get(API_URL+"/messages").then(response => {
    let data = response.data;
    data.map(msg => {
        $("#messages").append(`<li class="${msg.sender == Name ? 'senders' : ''}"><span>${msg.message}</span><span>${msg.sender}</span></li>`)
    })
})

$("form").submit((e) => {
    e.preventDefault();
    socket.emit("send", {message: $("#m").val(), sender: Name});
    $("#m").val("");
    return false;
})

$("#sub").click((e) => {
    Name = $("#name").val();
    $(".modal").fadeOut();
    socket.emit("registerName", Name);
})

socket.on("msg", (msg) => {
    $("#messages").append(`<li class="${msg.sender == Name ? 'senders' : ''}"><span>${msg.message}</span><span>${msg.sender}</span></li>`);
})

socket.on("joinedUser", (name) => {
    $("#messages").append(`<span>${name} Joined The Squad</span>`)
})

socket.on("count", (count) => {
    $("#counter").html(count);
})