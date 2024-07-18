import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";

interface leaderboardProps {
    leaderboardData: { name: string; score: number }[];
    scoreLabel: string;
}

const Leaderboard: React.FC<leaderboardProps> = ({
    leaderboardData,
    scoreLabel,
}) => {
    return (
        <div style={{ color: 'white', width: '100%' }}>
            <Table style={{ width: '100%' }}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ color: 'white' }}>Name</TableCell>
                        <TableCell style={{ color: 'white' }}>{scoreLabel}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {leaderboardData.map((leader) => (
                        <TableRow key={leader.name}>
                            <TableCell style={{ color: 'white' }}>{leader.name}</TableCell>
                            <TableCell style={{ color: 'white' }}>
                                {leader.score}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Leaderboard;
