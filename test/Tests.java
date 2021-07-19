@TestAnnotation(tests = 2)
public class Tests {
    @TestAnnotation(tests = 2, name = "Test Math")
    public static boolean[] test1() {
        // setup
        int a = 5;
        
        // test
        boolean[] results = new boolean[2];
        results[0] = (a == 5);
        results[1] = (a < 0);
        return results;
    }
    
    @TestAnnotation(tests = 2, name = "Test Books")
    public static boolean[] test2() {
        // setup
        Book b = new Book("Harry Potter");
        
        boolean[] results = new boolean[2];
        results[0] = (b.getTitle().equals("Harry Potter"));
        results[1] = (b.toString().equals("Book{\"Harry Potter\"}"));
        return results;
    }
}
