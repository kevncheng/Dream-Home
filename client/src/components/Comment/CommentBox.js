import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const CommentBox = ({
    onChangeText, comment, onCommentPressed, indent
}) => (
    <>
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows="4"
                    margin = 'normal'
                    placeholder = 'Write a comment'
                    variant="outlined"
                    value = { comment }
                    onChange = {e => onChangeText(e)}
                    style = {{ marginLeft: indent }}
                    fullWidth
                />

                <div style = {{ paddingBottom: '10px', zIndex: 1, marginLeft: indent }}>
                    <Button
                        onClick = {() => onCommentPressed()}
                    >
                                Comment
                    </Button>
                </div>
            </>
);

export default CommentBox;
