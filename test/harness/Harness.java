import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

// import Book;
public class Harness {
    private static final PrintStream sysout = System.out;
    private static final ByteArrayOutputStream capture = new ByteArrayOutputStream();
    private static final PrintStream ps = new PrintStream(capture);
    
    private static void test(int testID, Method testMethod) {
        sysout.println("test");
        String testName = testMethod.getAnnotation(TestAnnotation.class).name();
        sysout.println(testID + ":" + testName);
        
        long start = System.currentTimeMillis();
        long elapsed = 0;
        
        boolean[] results = new boolean[0];
        
        try {
            results = (boolean[]) testMethod.invoke(null);
            elapsed = System.currentTimeMillis() - start;
        } catch(IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
            e.printStackTrace(System.err);
            sysout.println("error: " + e.getMessage());
        }
        
        sysout.println(results.length);
        for(boolean res : results) {
            sysout.println(res);
        }
        sysout.println(elapsed + "ms");
        sysout.println("end");
    }
    public static void main(String[] args) {
        System.setOut(ps);
        
        
        int testCases = Tests.class.getAnnotation(TestAnnotation.class).tests();
        
        try {
            for(int i = 1; i <= testCases; i++) {
                Method test = Tests.class.getMethod("test" + i, new Class<?>[0]);
                test(i, test);
            }
        } catch(Exception e) {
            e.printStackTrace();
            sysout.println("error running tests");
        }
    }
}
