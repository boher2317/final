<div>
    <table class="container">
    <br>
    <div>
    Your High Scores
    </div>
    <br>
        <tr>
            <td> Easy </td>
            <td> Normal </td>
            <td> Hard </td>
            <td> Genius </td>
        </tr>
       
        <?php foreach ($positions as $position): ?>

        <tr>
            <td><?= $position["escore"] ?></td>
            <td><?= $position["nscore"] ?></td>
            <td><?= $position["hscore"] ?></td>
            <td><?= $position["gscore"] ?></td>
        </tr>

    <? endforeach ?>
    </table>
    <br><br>
    <button type="button" class="btn btn-info" id="back">Back to Main</button>
</div>
