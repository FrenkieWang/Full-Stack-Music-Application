import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  border: 1px solid black;
  text-align: center;

  th, td {
    border: 1px solid black;
    padding: 8px;
  }
`;

function SongsModal({ type, title, songlists, closeModal }) {
  return (
    <div>
      <h3>Songs of {type} -- {title}</h3>
      <Table>
        <thead>
          <tr>
            <th>Song ID</th>
            <th>Song Name</th>
            <th>Release Year</th>
          </tr>
        </thead>
        <tbody>
          {songlists.map(song => (
            <tr key={song.song_id}>
              <td>{song.song_id}</td>
              <td>{song.song_name}</td>
              <td>{song.release_year}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default SongsModal;
