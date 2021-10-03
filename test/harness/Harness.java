import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLClassLoader;

public class Harness {
    private static final PrintStream sysout = System.out;
    private static final ByteArrayOutputStream capture = new ByteArrayOutputStream();
    private static final PrintStream ps = new PrintStream(capture);

    public static void main(String[] args) {
        System.setOut(ps);

        Class<?> assignment = Harness.class.getClassLoader().loadClass("Assignment");

        Method[] tasks = meme.getMethods();

    }
}
