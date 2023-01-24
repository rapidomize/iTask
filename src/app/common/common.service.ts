/*
 * Copyright (c) 2012-2018,  Rapidomize(TM) Ltd. All Rights Reserved.
 * RAPIDOMIZE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * To use this software you should have received a copy of the License along with this software;
 * if not, please write to the
 *
 * contact@rapidomize.com
 *
 * 1049-C El Monte Avenue, Ste C, Mountain View, CA 94040
 * +1 650 603 0899
 *
 */

import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const alphaLen = alpha.length;

export class IdGen{
    static strId(): string{
        return (1+Math.random()*4294967295).toString(16);
    }

    static uuid(): string{
        return uuidv4();
    }
   
    static rndStr(size: number): string{
        let ret='';
        for ( let i = 0; i < size; i++ ) {
            ret += alpha.charAt(Math.floor(Math.random() * alphaLen));
        }
        return ret;
    }
}