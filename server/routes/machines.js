const express = require('express');

const Machine = require('../models/Machine');

const router = express.Router();

const UNIQUE_ID_PATTERN = /^ARK-\d{8}-[A-Z0-9]{4}$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidDate(value) {
  if (value === undefined || value === null || value === '') {
    return false;
  }
  return !Number.isNaN(new Date(value).getTime());
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// POST /api/machines
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { sellerCompanyName, machineName, modelNumber, saleDate } = req.body ?? {};

    const validationErrors = [];
    if (!isNonEmptyString(sellerCompanyName)) {
      validationErrors.push('sellerCompanyName is required and must be a non-empty string');
    }
    if (!isNonEmptyString(machineName)) {
      validationErrors.push('machineName is required and must be a non-empty string');
    }
    if (!isNonEmptyString(modelNumber)) {
      validationErrors.push('modelNumber is required and must be a non-empty string');
    }
    if (!isValidDate(saleDate)) {
      validationErrors.push('saleDate is required and must be a valid date');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const machine = new Machine({
      sellerCompanyName: sellerCompanyName.trim(),
      machineName: machineName.trim(),
      modelNumber: modelNumber.trim(),
      saleDate: new Date(saleDate),
    });

    await machine.save();

    return res.status(201).json({
      message: 'Machine registered successfully',
      uniqueId: machine.uniqueId,
      machine,
    });
  })
);

// GET /api/machines/:uniqueId
router.get(
  '/:uniqueId',
  asyncHandler(async (req, res) => {
    const { uniqueId } = req.params;

    if (!UNIQUE_ID_PATTERN.test(uniqueId)) {
      return res.status(400).json({ error: 'Invalid uniqueId format' });
    }

    const machine = await Machine.findOne({ uniqueId });

    if (!machine) {
      return res.status(404).json({ error: `Machine with uniqueId "${uniqueId}" not found` });
    }

    return res.status(200).json(machine);
  })
);

module.exports = router;
