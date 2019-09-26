import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';

class ProfilePic extends React.Component {
    onClickAvatar = () => {
        const { history, username, isCurrentUser } = this.props;
        if (isCurrentUser) {
            history.push(`/profile/${username}/edit`);
        }
    };

    render () {
        const { profile, isCurrentUser } = this.props;
        return (
            <div>
                <Tooltip title={isCurrentUser ? 'Edit Profile' : ''}>
                    <Avatar
                        className="subHeaderIcon"
                        src={profile}
                        onClick={() => this.onClickAvatar()}
                        style={isCurrentUser ? { cursor: 'pointer' } : {}}
                    />
                </Tooltip>
            </div>
        );
    }
}
export default withRouter(ProfilePic);
