import React from 'react';
import ShowRandom from './ShowRandom';
import RandomState from '../../../Context/Agency/Random/RandomState';

function Random() {
    return (
        <RandomState>
            <ShowRandom />
        </RandomState>
    );
}

export default Random;
