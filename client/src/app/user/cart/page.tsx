"use client"
import Cart from "@/component/cart/Cart";
import {  withAuth  } from "@/util/withAuth";

import React from 'react'

type Props = {}

function index({}: Props) {

  return (
    <><Cart/></>
  )
}

export default withAuth(index)