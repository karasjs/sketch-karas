import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('global')
@observer
class Global extends React.Component {
  render() {
    const { width, height, fps, bgc } = this.props.global;
    return <div class="global">
      <h1>全局属性</h1>
      <table>
        <tbody>
        <tr>
          <th>width:</th>
          <td>{width}</td>
          <th>height:</th>
          <td>{height}</td>
        </tr>
        <tr>
          <th>fps:</th>
          <td>{fps}</td>
          <th>bgc:</th>
          <td>{bgc}</td>
        </tr>
        </tbody>
      </table>
    </div>;
  }
}

export default Global;
