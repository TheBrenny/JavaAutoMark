public class Tests {
    public static void task1() {
        System.out.println("task1:start");
        
        // setup
        int a = 5;
        int b = 10;
        int c = a + b;
        int d = a - b;
        
        // test
        System.out.println("1,1,1"); // task 1, test 1, marks 1
        System.out.println(15); // print expected
        System.out.println(c); // print actual
        System.out.println(((Object) c).equals(15)); // print does match
        
        // test
        System.out.println("1,2,1"); // task 2, test 2, marks 2
        System.out.println(-5); // print expected
        System.out.println(d); // print actual
        System.out.println(((Object) d).equals(d)); // print does match
        
        System.out.println("task1:done");
    }
    
    public static void task2() {
        System.out.println("task2:start");
        
        // setup
        Book b = new Book("Harry Potter");
        String t = b.getTitle();
        String s = b.toString();
        
        // test
        System.out.println("2,1,1"); // task 2, test 1, marks 1
        System.out.println("Harry Potter"); // print expected
        System.out.println(t); // print actual
        System.out.println(((Object) t).equals("Harry Potter")); // print does match
        
        // test
        System.out.println("2,2,2"); // task 2, test 2, marks 2
        System.out.println("Book{\"Harry Potter\"}"); // print expected
        System.out.println(s); // print actual
        System.out.println(((Object) s).equals("Book{\"Harry Potter\"}")); // print does match
        
        System.out.println("task2:done");
    }
    
    // This was used to shut my IDE up
    // public static class Book {
    //     public Book(String title) {}
    //     public String getTitle() {
    //         return "";
    //     }
    // }
}
