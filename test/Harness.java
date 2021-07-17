public class Harness {
public static boolean test1() {
int a = 5;
int b = 10;
int c = a + b;
return c == 15;
}
public static void main(String[] args) {
try {  System.out.println("Test case 1: " + (test1()));  } catch(Exception e) {System.err.println(e.getMessage());}
}
}