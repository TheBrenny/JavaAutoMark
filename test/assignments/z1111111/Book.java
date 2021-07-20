public class Book {
    private String title;
    
    public Book(String title) {
        this.title = title;
    }
    
    public String getTitle() {
        return this.title;
    }
    
    public String toString() {
        return "Book{\"" + this.title + "\"}";
    }
}
