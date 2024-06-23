import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Scanner;

public class App {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/example";
    private static final String DB_USER = "jcaceresap";
    private static final String DB_PASSWORD = "12345";

    public static void main(String[] args) {
        Connection conn = null;
        PreparedStatement stmt = null;
        Scanner scanner = new Scanner(System.in);

        try {
            // Conectar a la base de datos
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            conn.setAutoCommit(false); // Desactivar el autocommit

            // Mostrar salarios antes de las transacciones
            mostrarSalarios(conn);

            // Primer paso de la transacción: Eliminar empleados del departamento de Recursos Humanos
            String eliminarRH = "DELETE FROM employees WHERE department = 'RH'";
            stmt = conn.prepareStatement(eliminarRH);
            stmt.executeUpdate();
            stmt.close(); // Cerrar PreparedStatement

            // Segundo paso de la transacción: Actualizar salarios para el departamento de Ingeniería
            String actualizarIngenieria = "UPDATE employees SET salary = 300000 WHERE department = 'Ingeniería'";
            stmt = conn.prepareStatement(actualizarIngenieria);
            stmt.executeUpdate();
            stmt.close(); // Cerrar PreparedStatement

            // Confirmar los pasos de la transacción con el usuario
            System.out.println("Los pasos de la transacción están listos. ¿Deseas guardar los cambios? (sí/no)");
            String entradaUsuario = scanner.nextLine();

            if ("sí".equalsIgnoreCase(entradaUsuario)) {
                conn.commit();
                System.out.println("Transacción confirmada.");
            } else {
                conn.rollback();
                System.out.println("Transacción revertida.");
            }

            // Mostrar salarios después de las transacciones
            mostrarSalarios(conn);

        } catch (SQLException e) {
            e.printStackTrace();
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        } finally {
            // Cerrar recursos
            try {
                if (stmt != null) {
                    stmt.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }

    private static void mostrarSalarios(Connection conn) throws SQLException {
        String consulta = "SELECT id, name, department, salary FROM employees";
        try (PreparedStatement stmt = conn.prepareStatement(consulta);
                ResultSet resultSet = stmt.executeQuery()) {

            System.out.println("Salarios de los empleados:");
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                String department = resultSet.getString("department");
                double salary = resultSet.getDouble("salary");

                System.out.println(
                        "ID: " + id + ", Nombre: " + name + ", Departamento: " + department + ", Salario: $" + salary);
            }
        }
    }
}
