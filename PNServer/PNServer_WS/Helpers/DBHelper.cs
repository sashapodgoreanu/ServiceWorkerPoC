using System.Data;
using System.Data.SqlClient;

namespace PNServer_WS.Helpers;

internal class DBHelper(string connectionString) {

    public async Task SaveSubscription(string subscription) {
        using var objConn = new SqlConnection(connectionString);
        objConn.Open();

        using SqlCommand cmd = objConn.CreateCommand();
        cmd.CommandText = "s_savesubscription";
        cmd.CommandType = CommandType.StoredProcedure;

        var p_jsonsub = new SqlParameter("@jsonsub", SqlDbType.NVarChar, 4000) { Value = subscription };
        cmd.Parameters.Add(p_jsonsub);

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<int> GetNumberOfSubscriptions() {
        using var objConn = new SqlConnection(connectionString);
        objConn.Open();

        using SqlCommand cmd = objConn.CreateCommand();
        cmd.CommandText = "select count(*) from pnsubscriptions";
        cmd.CommandType = CommandType.Text;

        object? result = await cmd.ExecuteScalarAsync();
        return (int) result!;
    } 

}
