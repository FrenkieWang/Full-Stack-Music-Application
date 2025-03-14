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

function AlbumsModal({ type, title, albumlists, closeModal }) {
  return (
    <div>
      <h3>Albums of {type} -- {title}</h3>
      <Table>
        <thead>
          <tr>
            <th>Album ID</th>
            <th>Album Name</th>
            <th>Release Year</th>
            <th>Number of Listens</th>
          </tr>
        </thead>
        <tbody>
          {albumlists.map(album => (
            <tr key={album.album_id}>
              <td>{album.album_id}</td>
              <td>{album.album_name}</td>
              <td>{album.release_year}</td>
              <td>{album.num_listens}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default AlbumsModal;
