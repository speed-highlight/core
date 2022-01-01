// create a simple program that takes a number and prints it out
package main

// import the fmt package
import "fmt"

// main is the entry point for the program
func main() {
	// declare a variable named num and assign it the value of 10
	num := 10

	// sanity check
	fmt.Println("num is", num)

	//scan from the console and assign the value to the variable num
	fmt.Scanln(&num)


	// print the value of num
	fmt.Println(num)
}