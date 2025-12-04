// ============================================
// NY LEGAL REFERENCES DATABASE
// Statutes, Deadlines, and Court Rules
// ============================================

const NY_LEGAL_REFERENCES = {

    // ============================================
    // PERSONAL INJURY / TORT
    // ============================================
    'personal-injury': {
        name: 'Personal Injury',
        tasks: [
            {
                id: 'pi-notice-of-claim',
                name: 'File Notice of Claim',
                description: 'File Notice of Claim against municipal entity',
                statute: 'General Municipal Law §50-e',
                deadline: '90 days from date of incident',
                deadlineDays: 90,
                fields: [
                    { name: 'incident_date', label: 'Date of Incident', type: 'date', required: true },
                    { name: 'municipality', label: 'Municipality/Entity', type: 'text', required: true },
                    { name: 'location', label: 'Location of Incident', type: 'text', required: true },
                    { name: 'description', label: 'Description of Claim', type: 'textarea', required: true },
                    { name: 'injuries', label: 'Nature of Injuries', type: 'textarea', required: true },
                    { name: 'damages', label: 'Damages Claimed', type: 'text' }
                ],
                notes: 'Must be served on municipal clerk. Late notice may be excused under GML §50-e(5) for reasonable excuse and lack of prejudice.'
            },
            {
                id: 'pi-summons-complaint',
                name: 'Draft Summons & Complaint',
                description: 'Prepare and file summons with complaint',
                statute: 'CPLR Article 3',
                deadline: 'Within statute of limitations (typically 3 years for PI)',
                fields: [
                    { name: 'plaintiff_name', label: 'Plaintiff Name', type: 'text', required: true },
                    { name: 'defendant_name', label: 'Defendant Name', type: 'text', required: true },
                    { name: 'venue', label: 'Venue (County)', type: 'select', options: ['New York', 'Kings', 'Queens', 'Bronx', 'Richmond', 'Nassau', 'Suffolk', 'Westchester'], required: true },
                    { name: 'causes_of_action', label: 'Causes of Action', type: 'textarea', required: true },
                    { name: 'damages_sought', label: 'Damages Sought', type: 'text' },
                    { name: 'jury_demand', label: 'Jury Demand', type: 'checkbox' }
                ],
                notes: 'CPLR §304 - Action commenced by filing. Service must be made within 120 days (CPLR §306-b).'
            },
            {
                id: 'pi-bill-of-particulars',
                name: 'Prepare Bill of Particulars',
                description: 'Draft verified bill of particulars',
                statute: 'CPLR §3043',
                deadline: '30 days after demand served',
                deadlineDays: 30,
                fields: [
                    { name: 'injuries_list', label: 'List of Injuries', type: 'textarea', required: true },
                    { name: 'medical_expenses', label: 'Medical Expenses (to date)', type: 'number' },
                    { name: 'lost_wages', label: 'Lost Wages', type: 'number' },
                    { name: 'permanency', label: 'Permanent Injuries Claimed', type: 'textarea' },
                    { name: 'serious_injury', label: 'Serious Injury Category (No-Fault)', type: 'select', options: ['Significant disfigurement', 'Bone fracture', 'Permanent loss of use', 'Permanent consequential limitation', 'Significant limitation of use', '90/180 day rule'] }
                ],
                notes: 'Must specify serious injury threshold category for motor vehicle cases (Insurance Law §5102(d)).'
            },
            {
                id: 'pi-note-of-issue',
                name: 'File Note of Issue',
                description: 'File note of issue and certificate of readiness',
                statute: 'CPLR §3402',
                deadline: 'After discovery complete, before trial',
                fields: [
                    { name: 'discovery_complete', label: 'Discovery Complete', type: 'checkbox', required: true },
                    { name: 'physical_exams_complete', label: 'Physical Exams Complete', type: 'checkbox' },
                    { name: 'depositions_complete', label: 'Depositions Complete', type: 'checkbox' },
                    { name: 'expert_disclosure', label: 'Expert Disclosure Filed', type: 'checkbox' }
                ],
                notes: 'Filing fee required. Case will be assigned to trial calendar.'
            },
            {
                id: 'pi-ime-prep',
                name: 'Prepare IME Documentation',
                description: 'Prepare client for Independent Medical Examination',
                statute: 'CPLR §3121',
                deadline: 'As scheduled by defense',
                fields: [
                    { name: 'ime_date', label: 'IME Date', type: 'date', required: true },
                    { name: 'ime_doctor', label: 'Examining Doctor', type: 'text' },
                    { name: 'ime_location', label: 'Location', type: 'text' },
                    { name: 'specialty', label: 'Medical Specialty', type: 'text' },
                    { name: 'records_provided', label: 'Medical Records Provided', type: 'checkbox' }
                ],
                notes: 'Client should bring ID. Cannot have attorney present during exam.'
            },
            {
                id: 'pi-labor-law',
                name: 'Analyze Labor Law Claims',
                description: 'Evaluate Labor Law §§240, 241 applicability',
                statute: 'Labor Law §§240, 241, 200',
                fields: [
                    { name: 'construction_site', label: 'Construction Site', type: 'checkbox' },
                    { name: 'elevation_related', label: 'Elevation-Related Hazard', type: 'checkbox' },
                    { name: 'gravity_related', label: 'Gravity-Related Accident', type: 'checkbox' },
                    { name: 'safety_devices', label: 'Safety Devices Provided', type: 'textarea' },
                    { name: 'owner_gc', label: 'Property Owner/GC', type: 'text' },
                    { name: 'section_240', label: '§240(1) Scaffold Law Applies', type: 'checkbox' },
                    { name: 'section_241', label: '§241(6) Industrial Code Applies', type: 'checkbox' }
                ],
                notes: 'Labor Law §240(1) imposes absolute liability on owners/GCs for elevation-related injuries. §241(6) requires violation of specific Industrial Code provision.'
            },
            {
                id: 'pi-settlement-demand',
                name: 'Draft Settlement Demand',
                description: 'Prepare comprehensive settlement demand package',
                fields: [
                    { name: 'policy_limits', label: 'Policy Limits', type: 'number' },
                    { name: 'medical_specials', label: 'Medical Specials', type: 'number', required: true },
                    { name: 'lost_earnings', label: 'Lost Earnings', type: 'number' },
                    { name: 'future_medicals', label: 'Future Medical Expenses', type: 'number' },
                    { name: 'pain_suffering', label: 'Pain & Suffering Demand', type: 'number' },
                    { name: 'total_demand', label: 'Total Demand', type: 'number', required: true },
                    { name: 'response_deadline', label: 'Response Deadline', type: 'date' }
                ]
            }
        ],
        statutes_of_limitation: {
            'general_negligence': { years: 3, statute: 'CPLR §214' },
            'medical_malpractice': { years: 2.5, statute: 'CPLR §214-a', notes: 'From act or continuous treatment' },
            'wrongful_death': { years: 2, statute: 'EPTL §5-4.1' },
            'municipal_claim': { years: 1, statute: 'GML §50-i', notes: 'After Notice of Claim' },
            'products_liability': { years: 3, statute: 'CPLR §214' }
        }
    },

    // ============================================
    // FAMILY LAW
    // ============================================
    'family-law': {
        name: 'Family Law',
        tasks: [
            {
                id: 'fl-summons-complaint',
                name: 'File Divorce Summons',
                description: 'File Summons with Notice or Summons and Complaint',
                statute: 'DRL §232',
                fields: [
                    { name: 'plaintiff_name', label: 'Plaintiff Name', type: 'text', required: true },
                    { name: 'defendant_name', label: 'Defendant Name', type: 'text', required: true },
                    { name: 'marriage_date', label: 'Date of Marriage', type: 'date', required: true },
                    { name: 'separation_date', label: 'Date of Separation', type: 'date' },
                    { name: 'grounds', label: 'Grounds for Divorce', type: 'select', options: ['Irretrievable breakdown (DRL §170(7))', 'Cruel and inhuman treatment', 'Abandonment (1+ year)', 'Imprisonment (3+ years)', 'Adultery', 'Living apart pursuant to separation agreement', 'Living apart pursuant to judgment of separation'], required: true },
                    { name: 'children', label: 'Minor Children', type: 'checkbox' },
                    { name: 'num_children', label: 'Number of Children', type: 'number' }
                ],
                notes: 'Automatic Orders take effect upon service (DRL §236(B)(2)). No transfer of assets, no insurance changes, no dissipation of marital property.'
            },
            {
                id: 'fl-statement-net-worth',
                name: 'Prepare Statement of Net Worth',
                description: 'Complete sworn statement of net worth',
                statute: 'DRL §236(B), 22 NYCRR §202.16',
                deadline: '10 days after preliminary conference',
                fields: [
                    { name: 'gross_income', label: 'Gross Annual Income', type: 'number', required: true },
                    { name: 'net_income', label: 'Net Annual Income', type: 'number', required: true },
                    { name: 'real_property', label: 'Real Property Value', type: 'number' },
                    { name: 'bank_accounts', label: 'Bank Accounts Total', type: 'number' },
                    { name: 'retirement_accounts', label: 'Retirement Accounts', type: 'number' },
                    { name: 'other_assets', label: 'Other Assets', type: 'number' },
                    { name: 'liabilities', label: 'Total Liabilities', type: 'number' },
                    { name: 'monthly_expenses', label: 'Monthly Expenses', type: 'number' }
                ],
                notes: 'Must attach tax returns, pay stubs, W-2s. Subject to perjury penalties.'
            },
            {
                id: 'fl-custody-petition',
                name: 'Draft Custody/Visitation Petition',
                description: 'Prepare custody or visitation petition',
                statute: 'FCA Article 6',
                fields: [
                    { name: 'petitioner', label: 'Petitioner Name', type: 'text', required: true },
                    { name: 'respondent', label: 'Respondent Name', type: 'text', required: true },
                    { name: 'children', label: 'Children Names/DOBs', type: 'textarea', required: true },
                    { name: 'custody_type', label: 'Custody Requested', type: 'select', options: ['Sole legal and physical', 'Joint legal, primary physical', 'Joint legal and physical', 'Visitation only'], required: true },
                    { name: 'current_arrangement', label: 'Current Arrangement', type: 'textarea' },
                    { name: 'best_interest_factors', label: 'Best Interest Factors', type: 'textarea' }
                ],
                notes: 'Best interest of child standard. Court considers domestic violence, substance abuse, parental fitness.'
            },
            {
                id: 'fl-child-support',
                name: 'Calculate Child Support (CSSA)',
                description: 'Calculate child support under Child Support Standards Act',
                statute: 'DRL §240(1-b)',
                fields: [
                    { name: 'cp_income', label: 'Custodial Parent Gross Income', type: 'number', required: true },
                    { name: 'ncp_income', label: 'Non-Custodial Parent Gross Income', type: 'number', required: true },
                    { name: 'fica_cp', label: 'CP FICA Deductions', type: 'number' },
                    { name: 'fica_ncp', label: 'NCP FICA Deductions', type: 'number' },
                    { name: 'num_children', label: 'Number of Children', type: 'select', options: ['1', '2', '3', '4', '5+'], required: true },
                    { name: 'childcare_costs', label: 'Childcare Costs', type: 'number' },
                    { name: 'health_insurance', label: 'Health Insurance Costs', type: 'number' },
                    { name: 'educational_expenses', label: 'Educational Expenses', type: 'number' }
                ],
                notes: 'CSSA percentages: 1 child=17%, 2=25%, 3=29%, 4=31%, 5+=35%. Cap at $183,000 combined income (2024). Add-ons: childcare, health insurance, educational expenses.'
            },
            {
                id: 'fl-maintenance',
                name: 'Prepare Maintenance Worksheet',
                description: 'Calculate spousal maintenance under 2016 guidelines',
                statute: 'DRL §236(B)(6)',
                fields: [
                    { name: 'payor_income', label: 'Payor Gross Income', type: 'number', required: true },
                    { name: 'payee_income', label: 'Payee Gross Income', type: 'number', required: true },
                    { name: 'marriage_length', label: 'Length of Marriage (years)', type: 'number', required: true },
                    { name: 'child_support_paid', label: 'Child Support Paid by Payor', type: 'number' },
                    { name: 'pre_post_divorce', label: 'Pre or Post-Divorce', type: 'select', options: ['Pendente lite (during)', 'Post-divorce'], required: true }
                ],
                notes: 'Duration guidelines: 0-15 years = 15-30% of marriage length; 15-20 years = 30-40%; 20+ years = 35-50%. Income cap: $228,000 (2024).'
            },
            {
                id: 'fl-osc',
                name: 'File Order to Show Cause',
                description: 'Prepare emergency motion via Order to Show Cause',
                statute: 'CPLR §2214',
                fields: [
                    { name: 'relief_requested', label: 'Relief Requested', type: 'textarea', required: true },
                    { name: 'emergency_basis', label: 'Emergency Basis', type: 'textarea', required: true },
                    { name: 'tro_requested', label: 'TRO Requested', type: 'checkbox' },
                    { name: 'stay_requested', label: 'Stay Requested', type: 'checkbox' },
                    { name: 'proposed_date', label: 'Proposed Return Date', type: 'date' }
                ],
                notes: 'Must show sufficient cause for short notice. Judge signs OSC with return date.'
            },
            {
                id: 'fl-stipulation',
                name: 'Draft Stipulation of Settlement',
                description: 'Prepare comprehensive settlement agreement',
                statute: 'DRL §236(B)(3)',
                fields: [
                    { name: 'equitable_distribution', label: 'Property Distribution Terms', type: 'textarea', required: true },
                    { name: 'maintenance_terms', label: 'Maintenance Terms', type: 'textarea' },
                    { name: 'child_support_terms', label: 'Child Support Terms', type: 'textarea' },
                    { name: 'custody_terms', label: 'Custody/Visitation Terms', type: 'textarea' },
                    { name: 'health_insurance', label: 'Health Insurance Terms', type: 'textarea' },
                    { name: 'life_insurance', label: 'Life Insurance Requirements', type: 'textarea' },
                    { name: 'retirement_division', label: 'Retirement Division Terms', type: 'textarea' }
                ],
                notes: 'Must be acknowledged before notary. Consider QDRO for retirement accounts.'
            }
        ],
        equitable_distribution_factors: [
            'Income and property at time of marriage and at commencement',
            'Duration of marriage and age/health of parties',
            'Need of custodial parent to occupy marital residence',
            'Loss of inheritance/pension rights',
            'Contributions as spouse, parent, homemaker',
            'Liquid or non-liquid character of assets',
            'Future financial circumstances',
            'Difficulty of valuing business interests',
            'Tax consequences',
            'Wasteful dissipation of assets',
            'Transfer/encumbrance in contemplation of divorce',
            'Any other factor court finds just and proper'
        ]
    },

    // ============================================
    // REAL ESTATE
    // ============================================
    'real-estate': {
        name: 'Real Estate',
        tasks: [
            {
                id: 're-contract-review',
                name: 'Review Contract of Sale',
                description: 'Review and negotiate purchase/sale contract',
                fields: [
                    { name: 'property_address', label: 'Property Address', type: 'text', required: true },
                    { name: 'purchase_price', label: 'Purchase Price', type: 'number', required: true },
                    { name: 'down_payment', label: 'Down Payment', type: 'number', required: true },
                    { name: 'mortgage_contingency', label: 'Mortgage Contingency', type: 'checkbox' },
                    { name: 'mortgage_amount', label: 'Mortgage Amount', type: 'number' },
                    { name: 'closing_date', label: 'Proposed Closing Date', type: 'date' },
                    { name: 'property_type', label: 'Property Type', type: 'select', options: ['Single Family', 'Condo', 'Co-op', 'Multi-Family', 'Commercial'], required: true },
                    { name: 'contingencies', label: 'Other Contingencies', type: 'textarea' }
                ],
                notes: 'Standard NYC contract is REBNY form. Attorney approval period typically 3 days.'
            },
            {
                id: 're-title-search',
                name: 'Order Title Search',
                description: 'Order and review title search and survey',
                fields: [
                    { name: 'title_company', label: 'Title Company', type: 'text' },
                    { name: 'search_ordered', label: 'Search Ordered Date', type: 'date' },
                    { name: 'exceptions', label: 'Title Exceptions Found', type: 'textarea' },
                    { name: 'liens', label: 'Outstanding Liens', type: 'textarea' },
                    { name: 'judgments', label: 'Judgments', type: 'textarea' },
                    { name: 'easements', label: 'Easements/Restrictions', type: 'textarea' }
                ],
                notes: 'Review for judgments, liens, encroachments, easements. Check tax status.'
            },
            {
                id: 're-cema',
                name: 'Prepare CEMA Documents',
                description: 'Consolidation, Extension, and Modification Agreement',
                statute: 'Tax Law §255',
                fields: [
                    { name: 'existing_mortgage', label: 'Existing Mortgage Amount', type: 'number', required: true },
                    { name: 'new_mortgage', label: 'New Mortgage Amount', type: 'number', required: true },
                    { name: 'gap_amount', label: 'Gap Amount (New - Existing)', type: 'number' },
                    { name: 'mortgage_tax_savings', label: 'Mortgage Tax Savings', type: 'number' },
                    { name: 'existing_lender', label: 'Existing Lender', type: 'text' },
                    { name: 'new_lender', label: 'New Lender', type: 'text' }
                ],
                notes: 'CEMA allows buyer to avoid mortgage recording tax on existing loan amount. Only pays tax on gap (new loan minus existing). NYC mortgage tax rate is 1.8% (under $500k) or 1.925% (over $500k).'
            },
            {
                id: 're-coop-board',
                name: 'Prepare Co-op Board Package',
                description: 'Assemble complete board application package',
                fields: [
                    { name: 'purchaser_name', label: 'Purchaser Name', type: 'text', required: true },
                    { name: 'financial_statement', label: 'Financial Statement Complete', type: 'checkbox' },
                    { name: 'tax_returns', label: 'Tax Returns (2-3 years)', type: 'checkbox' },
                    { name: 'employment_letter', label: 'Employment Verification', type: 'checkbox' },
                    { name: 'bank_statements', label: 'Bank Statements', type: 'checkbox' },
                    { name: 'reference_letters', label: 'Reference Letters', type: 'checkbox' },
                    { name: 'credit_report', label: 'Credit Report', type: 'checkbox' },
                    { name: 'dti_ratio', label: 'Debt-to-Income Ratio', type: 'text' }
                ],
                notes: 'Board can reject without reason under Business Judgment Rule. Typical DTI requirement under 28%.'
            },
            {
                id: 're-transfer-taxes',
                name: 'Calculate Transfer Taxes',
                description: 'Calculate all applicable transfer taxes',
                statute: 'Tax Law §1402; NYC Admin Code §11-2102',
                fields: [
                    { name: 'sale_price', label: 'Sale Price', type: 'number', required: true },
                    { name: 'is_nyc', label: 'NYC Property', type: 'checkbox' },
                    { name: 'is_residential', label: 'Residential (1-3 family)', type: 'checkbox' },
                    { name: 'is_new_construction', label: 'New Construction/Sponsor Sale', type: 'checkbox' },
                    { name: 'nys_transfer_tax', label: 'NYS Transfer Tax', type: 'number', readonly: true },
                    { name: 'nyc_transfer_tax', label: 'NYC Transfer Tax', type: 'number', readonly: true },
                    { name: 'mansion_tax', label: 'Mansion Tax', type: 'number', readonly: true }
                ],
                notes: 'NYS Transfer Tax: $2 per $500 (0.4%). NYC RPT: 1% (under $500k) or 1.425% (over $500k) for residential. Mansion Tax: Progressive 1%-3.9% on sales $1M+ (8 tiers). Seller typically pays transfer taxes; buyer pays mansion tax.'
            },
            {
                id: 're-closing-statement',
                name: 'Prepare Closing Statement',
                description: 'Prepare TRID closing disclosure / HUD-1 statement',
                statute: 'RESPA, TRID',
                fields: [
                    { name: 'purchase_price', label: 'Purchase Price', type: 'number', required: true },
                    { name: 'deposit', label: 'Contract Deposit', type: 'number' },
                    { name: 'mortgage_amount', label: 'Mortgage Amount', type: 'number' },
                    { name: 'closing_costs', label: 'Total Closing Costs', type: 'number' },
                    { name: 'prepaid_items', label: 'Prepaid Items', type: 'number' },
                    { name: 'adjustments', label: 'Prorations/Adjustments', type: 'textarea' },
                    { name: 'amount_due_from_buyer', label: 'Amount Due from Buyer', type: 'number' },
                    { name: 'amount_due_to_seller', label: 'Amount Due to Seller', type: 'number' }
                ]
            },
            {
                id: 're-rp5217',
                name: 'File RP-5217',
                description: 'Complete Real Property Transfer Report',
                statute: 'Real Property Law §333',
                deadline: '15 days after recording',
                fields: [
                    { name: 'sale_price', label: 'Sale Price', type: 'number', required: true },
                    { name: 'property_class', label: 'Property Class', type: 'text' },
                    { name: 'assessment', label: 'Current Assessment', type: 'number' },
                    { name: 'grantor', label: 'Grantor (Seller)', type: 'text', required: true },
                    { name: 'grantee', label: 'Grantee (Buyer)', type: 'text', required: true }
                ],
                notes: 'Required for all real property transfers. Filed with county clerk.'
            }
        ],
        nyc_transfer_taxes: {
            residential_under_500k: 0.01,
            residential_over_500k: 0.01425,
            commercial_under_500k: 0.01425,
            commercial_over_500k: 0.02625
        },
        mansion_tax_tiers: [
            { min: 1000000, max: 1999999, rate: 0.01 },
            { min: 2000000, max: 2999999, rate: 0.0125 },
            { min: 3000000, max: 4999999, rate: 0.015 },
            { min: 5000000, max: 9999999, rate: 0.0225 },
            { min: 10000000, max: 14999999, rate: 0.0325 },
            { min: 15000000, max: 19999999, rate: 0.035 },
            { min: 20000000, max: 24999999, rate: 0.0375 },
            { min: 25000000, max: Infinity, rate: 0.039 }
        ]
    },

    // ============================================
    // CRIMINAL DEFENSE
    // ============================================
    'criminal-defense': {
        name: 'Criminal Defense',
        tasks: [
            {
                id: 'cd-arraignment',
                name: 'Prepare for Arraignment',
                description: 'Prepare for client arraignment',
                statute: 'CPL Article 170, 180',
                fields: [
                    { name: 'defendant_name', label: 'Defendant Name', type: 'text', required: true },
                    { name: 'charges', label: 'Charges', type: 'textarea', required: true },
                    { name: 'arrest_date', label: 'Arrest Date', type: 'date', required: true },
                    { name: 'bail_eligible', label: 'Bail Eligible', type: 'checkbox' },
                    { name: 'prior_record', label: 'Prior Record', type: 'textarea' },
                    { name: 'community_ties', label: 'Community Ties', type: 'textarea' },
                    { name: 'employment', label: 'Employment Status', type: 'text' },
                    { name: 'bail_recommendation', label: 'Bail Recommendation', type: 'text' }
                ],
                notes: 'Under 2020 bail reform, most misdemeanors and non-violent felonies are non-bail eligible (CPL §510.10). Court must consider least restrictive conditions.'
            },
            {
                id: 'cd-omnibus-motion',
                name: 'File Omnibus Motion',
                description: 'Prepare comprehensive pretrial motion',
                statute: 'CPL §255.20',
                deadline: '45 days after arraignment on indictment',
                deadlineDays: 45,
                fields: [
                    { name: 'suppression_requested', label: 'Suppression Requested', type: 'checkbox' },
                    { name: 'huntley_hearing', label: 'Huntley Hearing (statements)', type: 'checkbox' },
                    { name: 'mapp_hearing', label: 'Mapp Hearing (search/seizure)', type: 'checkbox' },
                    { name: 'wade_hearing', label: 'Wade Hearing (identification)', type: 'checkbox' },
                    { name: 'dunaway_hearing', label: 'Dunaway Hearing (probable cause)', type: 'checkbox' },
                    { name: 'sandoval_hearing', label: 'Sandoval Hearing (prior bad acts)', type: 'checkbox' },
                    { name: 'bill_of_particulars', label: 'Bill of Particulars Demanded', type: 'checkbox' },
                    { name: 'discovery_demands', label: 'Discovery Demands', type: 'textarea' }
                ],
                notes: 'All pretrial motions must be filed within 45 days. Good cause required for late filing.'
            },
            {
                id: 'cd-suppression',
                name: 'Draft Suppression Motion',
                description: 'Motion to suppress physical evidence',
                statute: 'CPL Article 710',
                fields: [
                    { name: 'evidence_to_suppress', label: 'Evidence to Suppress', type: 'textarea', required: true },
                    { name: 'basis_for_suppression', label: 'Legal Basis', type: 'select', options: ['Illegal stop', 'Illegal search', 'Lack of probable cause', 'Lack of warrant', 'Fruit of poisonous tree', 'Miranda violation'], required: true },
                    { name: 'factual_basis', label: 'Factual Basis', type: 'textarea', required: true },
                    { name: 'case_law', label: 'Supporting Case Law', type: 'textarea' }
                ],
                notes: 'Defendant has burden to establish standing. People have burden to show legality of police conduct.'
            },
            {
                id: 'cd-discovery',
                name: 'Request Discovery (CPL 245)',
                description: 'Demand discovery under 2020 reforms',
                statute: 'CPL §245',
                deadline: '15 days after arraignment (automatic)',
                fields: [
                    { name: 'automatic_disclosure', label: 'Automatic Disclosure Received', type: 'checkbox' },
                    { name: 'witness_names', label: 'Witness Names Received', type: 'checkbox' },
                    { name: 'witness_statements', label: 'Witness Statements Received', type: 'checkbox' },
                    { name: 'expert_disclosure', label: 'Expert Disclosure Received', type: 'checkbox' },
                    { name: 'electronic_recordings', label: 'Electronic Recordings Received', type: 'checkbox' },
                    { name: 'brady_material', label: 'Brady Material Received', type: 'checkbox' },
                    { name: 'certificate_of_compliance', label: 'COC Filed by People', type: 'checkbox' }
                ],
                notes: 'Under CPL §245, People must disclose all evidence within 15 days (or 20 for felonies). COC required before trial. Automatic discovery is mandatory.'
            },
            {
                id: 'cd-bail-application',
                name: 'Analyze Bail Application',
                description: 'Prepare bail application under reform law',
                statute: 'CPL Article 510',
                fields: [
                    { name: 'charge_category', label: 'Charge Category', type: 'select', options: ['Non-qualifying offense', 'Qualifying offense', 'VFO with bail eligible'], required: true },
                    { name: 'flight_risk', label: 'Flight Risk Analysis', type: 'textarea' },
                    { name: 'danger_assessment', label: 'Danger Assessment (if applicable)', type: 'textarea' },
                    { name: 'least_restrictive', label: 'Least Restrictive Conditions Argument', type: 'textarea' },
                    { name: 'bail_amount_requested', label: 'Bail Amount Requested', type: 'text' },
                    { name: 'supervised_release', label: 'Supervised Release Requested', type: 'checkbox' }
                ],
                notes: '2020 bail reform eliminates cash bail for most misdemeanors and non-violent felonies. Court must set least restrictive conditions. No consideration of dangerousness except for VFOs.'
            },
            {
                id: 'cd-speedy-trial',
                name: 'Calculate Speedy Trial (30.30)',
                description: 'Calculate speedy trial time under CPL §30.30',
                statute: 'CPL §30.30',
                fields: [
                    { name: 'charge_type', label: 'Most Serious Charge', type: 'select', options: ['A Felony (6 months)', 'Other Felony (6 months)', 'Misdemeanor (90 days)', 'Violation (60 days)'], required: true },
                    { name: 'arraignment_date', label: 'Arraignment Date', type: 'date', required: true },
                    { name: 'total_time', label: 'Total Calendar Days', type: 'number' },
                    { name: 'excludable_time', label: 'Excludable Time (days)', type: 'number' },
                    { name: 'chargeable_time', label: 'Chargeable Time (days)', type: 'number' },
                    { name: 'time_remaining', label: 'Time Remaining', type: 'number' }
                ],
                notes: 'Excludable time: defense motions, defendant absence, continuances at defense request, competency proceedings. Post-readiness delays generally excluded.'
            },
            {
                id: 'cd-yo-eligibility',
                name: 'Analyze YO Eligibility',
                description: 'Evaluate Youthful Offender eligibility',
                statute: 'CPL §720.20',
                fields: [
                    { name: 'defendant_age', label: 'Defendant Age at Time of Offense', type: 'number', required: true },
                    { name: 'prior_yo', label: 'Prior YO Adjudication', type: 'checkbox' },
                    { name: 'prior_felony', label: 'Prior Felony Conviction', type: 'checkbox' },
                    { name: 'current_charge', label: 'Current Charge', type: 'text', required: true },
                    { name: 'is_armed_felony', label: 'Armed Felony', type: 'checkbox' },
                    { name: 'eligible', label: 'YO Eligible', type: 'checkbox' },
                    { name: 'mitigating_factors', label: 'Mitigating Factors', type: 'textarea' }
                ],
                notes: 'Must be 16-18 at time of offense. Not eligible if prior YO or felony conviction. Armed felonies require exceptional circumstances. YO adjudication is sealed.'
            }
        ],
        speedy_trial_limits: {
            'a_felony': 6,
            'felony': 6,
            'misdemeanor': 90,
            'violation': 60
        }
    }
};

// Helper function to get task by ID
function getTaskById(practiceArea, taskId) {
    const area = NY_LEGAL_REFERENCES[practiceArea];
    if (!area) return null;
    return area.tasks.find(t => t.id === taskId);
}

// Helper function to get all tasks for a practice area
function getTasksForPracticeArea(practiceArea) {
    const area = NY_LEGAL_REFERENCES[practiceArea];
    return area ? area.tasks : [];
}

// Calculate deadline date from incident date
function calculateDeadline(incidentDate, days) {
    const date = new Date(incidentDate);
    date.setDate(date.getDate() + days);
    return date;
}

// Check if deadline is approaching (within 30 days)
function isDeadlineApproaching(deadlineDate) {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
}

// Check if deadline has passed
function isDeadlinePassed(deadlineDate) {
    return new Date(deadlineDate) < new Date();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NY_LEGAL_REFERENCES,
        getTaskById,
        getTasksForPracticeArea,
        calculateDeadline,
        isDeadlineApproaching,
        isDeadlinePassed
    };
}
