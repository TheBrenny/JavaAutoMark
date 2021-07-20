@TestAnnotation(tests = 2)
public class Tests {
    @TestAnnotation(tests = 1, name = "Math Test")
    public static boolean[] test1() {
        // setup
        int a = 5;
        int b = 10;
        int c = a + b;
        
        // test
        boolean[] results = new boolean[1];
        results[0] = (c == 15);
        return results;
    }
    @TestAnnotation(tests = 2, name = "Book Test")
    public static boolean[] test2() {
        // setup
        Book b = new Book("Harry Potter");
        String t = b.getTitle();
        String s = b.toString();
        
        // test
        boolean[] results = new boolean[2];
        results[0] = (t.equals("Harry Potter"));
        results[1] = (s.equals("Book{\"Harry Potter\"}"));
        return results;
    }
}
