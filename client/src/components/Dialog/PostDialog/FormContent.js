import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';

const FormContent = ({
    onChangeText,
    onSubmitPress,
    titleError,
    tagError,
    linkError,
    descriptionError,
    title,
    tag,
    link,
    description
}) => {
    return (
        <Fragment>
            <TextField
                autoFocus
                margin='dense'
                id='title'
                label='Add your title'
                type='title'
                fullWidth
                onChange={e => onChangeText(e)}
                value={title}
                helperText={titleError}
                error={Boolean(titleError)}
                FormHelperTextProps={{ style: { float: 'left', position: 'absolute', bottom: -15 } }}
            />

            <TextField
                margin='dense'
                id='description'
                label='A description of your post'
                type='text'
                multiline
                fullWidth
                onChange={e => onChangeText(e)}
                value={description}
                helperText={descriptionError}
                error={Boolean(descriptionError)}
                FormHelperTextProps={{ style: { float: 'left', position: 'absolute', bottom: -15 } }}
            />

            <TextField
                margin='dense'
                id='link'
                label='Add a destination link'
                type='text'
                fullWidth
                onChange={e => onChangeText(e)}
                value={link}
                helperText={linkError}
                error={Boolean(linkError)}
                FormHelperTextProps={{ style: { float: 'left', position: 'absolute', bottom: -15 } }}
            />

            <TextField
                margin='dense'
                id='tag'
                label='Press "Enter" to create tags'
                type='text'
                fullWidth
                value={tag}
                onChange={e => onChangeText(e)}
                onKeyPress={e => onSubmitPress(e)}
                error={Boolean(tagError)}
                helperText={tagError}
                autoComplete='off'
                style = {{ marginBottom: '15px' }}
                FormHelperTextProps={{ style: { float: 'left', position: 'absolute', bottom: -15 } }}
            />
        </Fragment>
    );
};

export default FormContent;
