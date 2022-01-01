/*
	create a simple multithreaded server
*/

//include the library
use std::net::{TcpListener, TcpStream};
use std::io::{Read, Write};
use std::thread;

//function that handles the client
fn handle_client(mut stream: TcpStream) {
	//read the message
	let mut buffer = [0; 512];
	stream.read(&mut buffer).unwrap();
	//print the message
	println!("{}", String::from_utf8_lossy(&buffer[..]));
	//write the message back
	stream.write(&buffer).unwrap();
}

//main function
fn main() {
	//create a listener
	let listener = TcpListener::bind("127.0.0.1:8080").unwrap();
	//listen for connections
	for stream in listener.incoming() {
		//handle the connection
		match stream {
			Ok(stream) => {
				thread::spawn(move || {
					handle_client(stream);
				});
			}
			Err(e) => {
				println!("Error: {}", e);
			}
		}
	}