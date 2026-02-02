
import React from 'react';
import { TeamStats } from '../types';

interface LeagueTableProps {
  title: string;
  teams: TeamStats[];
}

const LeagueTable: React.FC<LeagueTableProps> = ({ title, teams }) => {
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const bGD = b.goalsFor - b.goalsAgainst;
    const aGD = a.goalsFor - a.goalsAgainst;
    if (bGD !== aGD) return bGD - aGD;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
      <div className="bg-gradient-to-r from-[#800000] to-[#5d0000] p-6 text-white flex justify-between items-center">
        <div>
          <h3 className="cinzel text-xl font-bold tracking-wide">{title}</h3>
          <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Current Standings</p>
        </div>
        <i className="fa-solid fa-trophy text-2xl text-[#d4af37]"></i>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Pos</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">P</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">W</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">D</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">L</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center hidden md:table-cell">GF</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center hidden md:table-cell">GA</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">GD</th>
              <th className="px-4 py-4 text-xs font-bold text-[#800000] uppercase tracking-wider text-center bg-[#800000]/5">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTeams.map((team, index) => {
              const gd = team.goalsFor - team.goalsAgainst;
              return (
                <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-center font-bold text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                      {team.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600">{team.played}</td>
                  <td className="px-4 py-4 text-center text-gray-600">{team.won}</td>
                  <td className="px-4 py-4 text-center text-gray-600">{team.drawn}</td>
                  <td className="px-4 py-4 text-center text-gray-600">{team.lost}</td>
                  <td className="px-4 py-4 text-center text-gray-600 hidden md:table-cell">{team.goalsFor}</td>
                  <td className="px-4 py-4 text-center text-gray-600 hidden md:table-cell">{team.goalsAgainst}</td>
                  <td className={`px-4 py-4 text-center font-medium ${gd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-[#800000] bg-[#800000]/5">{team.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeagueTable;
