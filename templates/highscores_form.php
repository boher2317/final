<div>
    <table class="container">
    <br>
    <div>
    Public High Scores
    </div>
    <br>
        <tr>
            <td> Easy </td>
            <td> Normal </td>
            <td> Hard </td>
            <td> Genius </td>
        </tr> 
        <tr>
            <td><?= $positions[0]["euser"] ?> - <?= $positions[0]["hescore"]?></td>
            <td><?= $positions[0]["nuser"] ?> - <?= $positions[0]["hnscore"]?></td>
            <td><?= $positions[0]["huser"] ?> - <?= $positions[0]["hhscore"]?></td>
            <td><?= $positions[0]["guser"] ?> - <?= $positions[0]["hgscore"]?></td>
        </tr>
    </table>
    <br><br>
    <button type="button" class="btn btn-info" id="back">Back to Main</button>
</div>
