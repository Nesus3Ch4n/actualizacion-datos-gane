import java.sql.*;

public class FixDates {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:../bd/bd.db";
        
        try (Connection conn = DriverManager.getConnection(url)) {
            System.out.println("Connected to SQLite database");
            
            // Check current data
            System.out.println("\n=== CURRENT DATA IN FAMILIA ===");
            String selectQuery = "SELECT ID_FAMILIA, ID_USUARIO, NOMBRE, PARENTESCO, FECHA_NACIMIENTO, EDAD, VERSION FROM FAMILIA";
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(selectQuery)) {
                
                while (rs.next()) {
                    System.out.println("ID: " + rs.getLong("ID_FAMILIA") + 
                                     ", User: " + rs.getLong("ID_USUARIO") +
                                     ", Name: " + rs.getString("NOMBRE") +
                                     ", Relation: " + rs.getString("PARENTESCO") +
                                     ", Date: " + rs.getString("FECHA_NACIMIENTO") +
                                     ", Age: " + rs.getInt("EDAD"));
                }
            }
            
            // Fix invalid dates
            System.out.println("\n=== FIXING INVALID DATES ===");
            String updateQuery = "UPDATE FAMILIA SET FECHA_NACIMIENTO = NULL WHERE FECHA_NACIMIENTO = '1751950800000' OR FECHA_NACIMIENTO = '' OR FECHA_NACIMIENTO IS NULL";
            try (Statement stmt = conn.createStatement()) {
                int rowsAffected = stmt.executeUpdate(updateQuery);
                System.out.println("Rows updated: " + rowsAffected);
            }
            
            // Verify data after fix
            System.out.println("\n=== DATA AFTER FIX ===");
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(selectQuery)) {
                
                while (rs.next()) {
                    System.out.println("ID: " + rs.getLong("ID_FAMILIA") + 
                                     ", User: " + rs.getLong("ID_USUARIO") +
                                     ", Name: " + rs.getString("NOMBRE") +
                                     ", Relation: " + rs.getString("PARENTESCO") +
                                     ", Date: " + rs.getString("FECHA_NACIMIENTO") +
                                     ", Age: " + rs.getInt("EDAD"));
                }
            }
            
        } catch (SQLException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 